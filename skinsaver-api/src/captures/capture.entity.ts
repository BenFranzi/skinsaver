import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn, ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {StorageEntity} from '../storage/storage.entity';
import {CaseEntity} from '../cases/case.entity';

export interface ICapture {
    id: string;
    case: CaseEntity;
    prediction: string;
    certainty: number;
    results: object;
    file: StorageEntity;
    createdDate: Date;
    updatedDate: Date;
}

@Entity('capture')
export class CaptureEntity implements ICapture {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    //Note: called caseEntity because case is a reserve word
    @ManyToOne((type) => CaseEntity, (caseEntity) => caseEntity.captures)
    public case: CaseEntity;

    @Column()
    public prediction: string;

    @Column("decimal", { precision: 4, scale: 3})
    public certainty: number;

    @Column({type: 'jsonb', nullable: true})
    public results: object;

    @OneToOne((type) => StorageEntity, (file) => file.capture)
    @JoinColumn()
    public file: StorageEntity;

    @CreateDateColumn()
    public createdDate: Date;

    @UpdateDateColumn()
    public updatedDate: Date;
}