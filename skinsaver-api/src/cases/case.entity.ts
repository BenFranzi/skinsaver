import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {CaptureEntity} from '../captures/capture.entity';
import {UserEntity} from '../users/user.entity';
import {LinkerEntity} from '../linker/linker.entity';


const adjectives = ['Quizzical', 'Zigzag', 'Carrot', 'Potato', 'Giraffe', 'Notorious'];
const names = ['Green', 'Red', 'Brown', 'Purple', 'Blue', 'Pink', 'Teal'];
export const makeTitle = () => {
    const a = Math.floor(Math.random() * adjectives.length);
    const b = Math.floor(Math.random() * names.length);
    return `Case ${adjectives[a]} ${names[b]}`;
};


export interface ICase {
    id: string;
    linkers: LinkerEntity[];
    user: UserEntity;
    title: string;
    captures: CaptureEntity[];
    createdDate: Date;
    updatedDate: Date;
}

@Entity('case')
export class CaseEntity implements ICase {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @OneToMany((type) => LinkerEntity, (linker) => linker.linkedCase, {nullable: true})
    public linkers: LinkerEntity[];

    @ManyToOne((type) => UserEntity, (user) => user.cases)
    public user: UserEntity;

    @Column()
    public title: string;

    @OneToMany((type) => CaptureEntity, (capture) => capture.case, {nullable: true})
    public captures: CaptureEntity[];

    @CreateDateColumn()
    public createdDate: Date;

    @UpdateDateColumn()
    public updatedDate: Date;
}