import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, ManyToOne, OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn
} from 'typeorm';
import * as shortid from 'shortid';
import {CaseEntity} from '../cases/case.entity';
import {StorageEntity} from '../storage/storage.entity';

export interface ILinker {
    id: string;
    uri: string;
    expiry: Date;
    linkedCase: CaseEntity;
    createdDate: Date;
    updatedDate: Date;
}

@Entity('linker')
export class LinkerEntity implements ILinker {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public uri: string;

    @Column({nullable: true})
    public expiry: Date;

    @ManyToOne((type) => CaseEntity, (linkedCase) => linkedCase.linkers)
    @JoinColumn()
    public linkedCase: CaseEntity;

    @CreateDateColumn()
    public createdDate: Date;

    @UpdateDateColumn()
    public updatedDate: Date;
}

export const generateUri = (): string  => {
    return shortid.generate();
}

