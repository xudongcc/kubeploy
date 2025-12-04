import { EventEmitterModule } from '@nestjs/event-emitter';

const EventEmitterDynamicModule = EventEmitterModule.forRoot();

export { EventEmitterDynamicModule as EventEmitterModule };
