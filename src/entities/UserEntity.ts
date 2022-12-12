import { Entity, Column, Index } from 'typeorm';
import AppBaseEntity from '@database/core/AppBaseEntity';
import bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import jwt from 'jsonwebtoken';
import appConfig from '@config/index';
import { omit } from 'lodash';

type AuthPayload = {
    user: Omit<UserEntity, 'password' | 'deleted'>;
    jwt: string;
};

@Entity()
export class UserEntity extends AppBaseEntity {
    @Column('varchar')
    name!: string;

    @Column('varchar')
    @Index('userEmail', { unique: true })
    email!: string;

    @Column('varchar', { nullable: true, default: null })
    @Exclude()
    password!: string;

    @Column('varchar', { default: null, nullable: true })
    avatar?: string;

    encryptPassword() {
        this.password = bcrypt.hashSync(this.password, 16);
    }

    isValidPassword(password: string) {
        return bcrypt.compareSync(password, this.password);
    }

    toAuthPayload(): AuthPayload {
        const token = jwt.sign(
            {
                name: this.name,
            },
            appConfig.auth.jwtSecret,
            {
                issuer: appConfig.server.hostname,
                expiresIn: '24 hours',
            },
        );

        return {
            user: omit(this, ['password', 'deleted']),
            jwt: token,
        };
    }
}
