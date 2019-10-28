import {Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';
import { STORAGE_TYPE } from './storage.constants';
import {CaptureEntity} from '../captures/capture.entity';

export interface IStorage {
  id: string;
  originalname: string;
  filename: string;
  url: string;
  key: string;
  size: number;
  mimetype: string;
  capture: CaptureEntity;
  storageType: STORAGE_TYPE;
  createdDate: Date;
  updatedDate: Date;
}

@Entity("storage")
export class StorageEntity implements IStorage {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalname: string;

  @Column()
  filename: string;

  @Column({ unique: true })
  url: string;

  // Used to identify file on storage system
  @Column({ unique: true })
  key: string;

  @Column()
  size: number;

  @OneToOne(type => CaptureEntity, capture => capture.file)
  capture: CaptureEntity;

  @Column()
  mimetype: string;

  @Column({ type: 'enum', enum: STORAGE_TYPE })
  storageType: STORAGE_TYPE;

  @CreateDateColumn()
  public createdDate: Date;

  @UpdateDateColumn()
  public updatedDate: Date;
}
