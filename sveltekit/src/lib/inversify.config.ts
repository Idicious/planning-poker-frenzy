import { ContainerModule } from 'inversify';
import { Tokens } from './di-tokens';
import { ImageService } from './profile/image.service';
import { imageKitConfig } from './profile/imagekit.config';
import { ProfileService } from './profile/profile.service';

export const appContainer = new ContainerModule((bind) => {
	bind(ProfileService).toSelf().inRequestScope();
	bind(ImageService).toSelf().inRequestScope();
	bind(Tokens.ImageKitConfig).toConstantValue(imageKitConfig);
});
