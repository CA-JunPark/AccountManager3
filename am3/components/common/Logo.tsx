import { Avatar, AvatarFallbackText, AvatarImage} from '@/components/ui/avatar';
import { memo } from 'react';
import * as FileSystem from 'expo-file-system';

interface LogoBubbleProps {
title: string;
logo: string;
}

// ???????? why it says  (NOBRIDGE) WARN  source.uri should not be an empty string [Component Stack] 
// if only logo === "@/assets/images/react-logo.png" is given
export const LogoBubble = memo(({ title, logo }: LogoBubbleProps) => {
    const noLogo = logo === '' || logo === "@/assets/images/react-logo.png";
    return (
    <Avatar size="xl">
        {noLogo ? (
        <AvatarFallbackText size="md">{title}</AvatarFallbackText>
        ) : (
        <AvatarImage source={{ uri: logo }} />
        )}
    </Avatar>
    );
});    

export const convertBase64toPngURI = async (base64String: string, id: number) => {
  const fileUri = `${FileSystem.documentDirectory}temp_image${id}.png`;
  await FileSystem.writeAsStringAsync(fileUri, base64String, { encoding: FileSystem.EncodingType.Base64 });
  return fileUri;
};

export default {LogoBubble, convertBase64toPngURI};