import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    getRepository,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import {CaseEntity} from '../cases/case.entity';

const crypto = require('crypto');

export enum UserRole {
    STANDARD = 'standard',
    ADMIN = 'admin',
}

export interface IUser {
    id: string;
    email: string;
    password: string;
    role: UserRole;
    cases: CaseEntity[];
    createdDate: Date;
    updatedDate: Date;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
    changePassword: (plaintext: string) => Promise<UserEntity>;
    authenticate: (plaintext: string) => Promise<UserEntity>;
}


@Entity('user')
export class UserEntity implements IUser {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @Column()
    public email: string;

    @OneToMany((type) => CaseEntity, (caseEntity) => caseEntity.user)
    public cases: CaseEntity[];

    @Column({select: false})
    public salt: string;

    @Column({select: false})
    public password: string;

    @Column({select: false, nullable: true})
    public resetPasswordToken: string;

    @Column({nullable: true})
    public resetPasswordExpires: Date;

    @CreateDateColumn()
    public createdDate: Date;

    @UpdateDateColumn()
    public updatedDate: Date;

    @Column({type: 'enum', enum: UserRole, default: UserRole.STANDARD})
    public role: UserRole;

    public async changePassword(plaintext: string): Promise<UserEntity> {
        const repository = getRepository('user');
        const salt = await UserEntity.makeSalt();
        this.salt = salt;
        this.password = await UserEntity.encryptPassword(salt, plaintext);
        this.resetPasswordExpires = null;
        this.resetPasswordToken = null;
        return await repository.save(this);
    }

    public async authenticate(plaintext: string): Promise<UserEntity> {
        const values = await this.getUnselectableValues();
        const hash = await UserEntity.encryptPassword(values.salt, plaintext);
        if (values.password === hash) {
            return this;
        }
        return null;
    }

    public static async create(user: Partial<UserEntity>): Promise<UserEntity> {
        const repository = getRepository('user');
        const exists = await repository.count({ email: user.email });
        if (exists) {
            throw new Error('User Already Exists');
        }
        const entity = new UserEntity();
        entity.email = user.email.toLowerCase().trim();
        entity.role = user.role;
        const salt = await this.makeSalt();
        entity.salt = salt;
        entity.password = await this.encryptPassword(salt, user.password);
        return await repository.save(entity);
    }

    private static async makeSalt(): Promise<string> {
        return await crypto.randomBytes(16).toString('base64');
    }

    private static async encryptPassword(currSalt: string, password: string) {
        if (!password || !currSalt) {
            return '';
        }
        const salt = Buffer.from(currSalt, 'base64');
        return await crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
    }

    /**
     * By making the password and salt unaccessable to queries it becomes impossible
     * to access the values within the entity. A query needs to be performed to get
     * the values at this level
     */
    private async getUnselectableValues(): Promise<{password: string, salt: string}> {
        const currUser = await getRepository(UserEntity)
            .createQueryBuilder('user')
            .addSelect('user.password')
            .addSelect('user.salt')
            .where('user.id = :id', { id: this.id })
            .getOne();
        return {password: currUser.password, salt: currUser.salt};
    }

}
