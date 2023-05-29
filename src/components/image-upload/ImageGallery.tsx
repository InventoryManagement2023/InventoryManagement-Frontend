import { FC, useContext, useState } from 'react';
import { IPicture } from 'components/interfaces';
import { Container, useMediaQuery } from '@mui/material';
import styles from 'styles/ImageGallery.module.scss';
import { UserContext } from 'pages/_app';
import lightTheme from 'styles/theme';
import inventoryManagementService from "service/inventoryManagementService";

interface IImageGalleryProps {
    images: IPicture[];
}

const ImageGallery: FC<IImageGalleryProps> = ({ images }) => {
    const [activeImage, setActiveImage] = useState<IPicture | null>(images[0]);
    const { themeMode } = useContext(UserContext);
    const matchesTablet = useMediaQuery(lightTheme.breakpoints.down('md'));
    const openPictureInPopUp = (picture:IPicture | null) => {
        const image = new Image();
        image.src = picture?.pictureUrl as string;
        const w = window.open('', '', 'popup');
        if (w) {
            w.document.write(image.outerHTML);
        }
    }
    const onOpen = () => {
        if(activeImage?.thumbnailUrl){
            inventoryManagementService.getPicture(activeImage.id as number).then(picture => {
                openPictureInPopUp(picture);
            }).catch(error => {
               console.log(error);
            });
        }else{
            openPictureInPopUp(activeImage);
        }
    }
    const getImages = () => {
        if (images) {
            return (
                <div className={images.length < 4 && !matchesTablet ? styles.thumbnailcontainer : `${styles.thumbnailcontainer} ${styles.morethanthree}`}>
                    {images.map((picture, index) => {
                        const image = new Image();
                        image.src = picture.thumbnailUrl?picture.thumbnailUrl as string :picture.pictureUrl as string;
                        return (
                            <div
                                key={`picture-${picture.id}-${index}`}
                                className={
                                    picture.id === activeImage?.id
                                        ? themeMode === 'dark'
                                            ? `${styles.thumbnail} ${styles.activedarkmode}`
                                            : `${styles.thumbnail} ${styles.activelightmode}`
                                        : themeMode === 'dark'
                                        ? `${styles.thumbnail} ${styles.darkmode}`
                                        : `${styles.thumbnail} ${styles.lightmode}`
                                }
                                onClick={() => setActiveImage(picture)}
                            >
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                />
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return null;
        }
    };

    return matchesTablet ? (
        <Container disableGutters>
            <div
                className={themeMode === 'dark' ? `${styles.image} ${styles.darkmode}` : `${styles.image} ${styles.lightmode}`}
                onClick={() => onOpen()}
            >
                <img
                    src={activeImage?.thumbnailUrl?activeImage?.thumbnailUrl as string :activeImage?.pictureUrl as string}
                    alt="active image"
                    id="activeImage"
                />
            </div>
            {getImages()}
        </Container>
    ) : (
        <Container
            sx={{
                display: 'flex',
                flexFlow: 'row nowrap'
            }}
            disableGutters
        >
            <div
                className={themeMode === 'dark' ? `${styles.image} ${styles.darkmode}` : `${styles.image} ${styles.lightmode}`}
                onClick={() => onOpen()}
                style={{ marginRight: '10px' }}
            >
                <img
                    src={activeImage?.thumbnailUrl?activeImage?.thumbnailUrl as string :activeImage?.pictureUrl as string}
                    alt="active image"
                    id="activeImage"
                />
            </div>
            {getImages()}
        </Container>
    );
};

export default ImageGallery;
