import { Avatar, AvatarFallbackText, AvatarImage} from '@/components/ui/avatar';
import * as FileSystem from 'expo-file-system';

interface LogoBubbleProps {
title: string;
logo: string;
}

export const LogoBubble = ({ title, logo }: LogoBubbleProps) => {
    return (
    <Avatar size="xl">
        {logo === '' || logo === "@/assets/images/react-logo.png" ? (
        <AvatarFallbackText size="md">{title}</AvatarFallbackText>
        ) : (
        <AvatarImage source={{ uri: logo }} />
        )}
    </Avatar>
    );
};    

export const convertBase64toPngURI = async (base64String: string, id: number) => {
  const fileUri = `${FileSystem.documentDirectory}temp_image${id}.png`;
  await FileSystem.writeAsStringAsync(fileUri, base64String, { encoding: FileSystem.EncodingType.Base64 });
  return fileUri;
};

export default {LogoBubble, convertBase64toPngURI};