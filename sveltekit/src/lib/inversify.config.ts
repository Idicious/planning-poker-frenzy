import { ContainerModule } from 'inversify';
import { AuthService } from './auth/auth.service';
import { Tokens } from './di-tokens';
import { ImageService } from './profile/image.service';
import { imageKitConfig } from './profile/imagekit.config';
import { ProfileService } from './profile/profile.service';
import { RoomService } from './room';

export const appContainer = new ContainerModule((bind) => {
	bind(ProfileService).toSelf().inRequestScope();
	bind(ImageService).toSelf().inRequestScope();
	bind(AuthService).toSelf().inRequestScope();
	bind(RoomService).toSelf().inRequestScope();
	bind(Tokens.ImageKitConfig).toConstantValue(imageKitConfig);
});
