import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Suspense } from "react";
import { ActivityIndicator } from "react-native";
import { SQLiteProvider, openDatabaseAsync, openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import migrations from '@/drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

export const DATABASE_NAME = 'accounts';

export default function RootLayout() {
  const expoDB = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDB);
  useDrizzleStudio(db);
  const {success, error} = useMigrations(db, migrations)

  return (
    <Suspense fallback={<ActivityIndicator size="large"/>}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        options={{enableChangeListener: true}}
        useSuspense
      >
        <GluestackUIProvider>
          <Stack screenOptions={{headerShown: false} }>
            <Stack.Screen name="(home)"/>
          </Stack>
        </GluestackUIProvider>
      </SQLiteProvider>
    </Suspense>
  );
}
