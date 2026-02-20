import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnModuleInit {
    private readonly logger = new Logger(DatabaseService.name);

    constructor(
        @InjectConnection()
        private readonly connection: Connection
    ) { }

    onModuleInit() {

        if (this.connection.readyState === 1) {
            this.logger.log('MongoDB is already connected');
            console.log('MongoDB is already connected');

            this.connection.on('connected', () => {
                this.logger.log('MongoDB connected successfully');
                console.log('MongoDB connected successfully');
            });

            this.connection.on('disconnected', () => {
                this.logger.warn('MongoDB disconnected');
                console.log(' MongoDB disconnected');
            });

            this.connection.on('error', (error) => {
                this.logger.error(`MongoDB connection error: ${error.message}`);
                console.error('MongoDB connection error:', error);
            });
        }
    }
}