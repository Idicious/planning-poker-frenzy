import { ContainerModule } from 'inversify';
import { AvatarService } from './profile/avatar.service';
import { ProfileService } from './profile/profile.service';

export const appContainer = new ContainerModule((bind) => {
	bind(ProfileService).toSelf().inRequestScope();
	bind(AvatarService).toSelf().inRequestScope();
});
