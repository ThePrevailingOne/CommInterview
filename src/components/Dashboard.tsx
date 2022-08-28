import { Box, Button, Divider, Group, Image, Stack, Text } from "@mantine/core";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { listenUserUpdate, unSubUserUpdate } from "../firebase/firestore";
import UpdateModal from "./UpdateModal";

interface PropType {
  user: User | undefined | null;
}

const Dashboard = ({ user }: PropType) => {
  const [appUser, setAppUser] = useState<AppUser>();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (user) {
      listenUserUpdate(user, (data) => {
        setAppUser(data);
      });
      return;
    }
    unSubUserUpdate();
  }, [user]);
  return (
    <Box
      sx={{
        maxWidth: 600,
        marginTop: 100,
        borderRadius: 8,
        backgroundColor: "#FAFAFA",
        padding: 32,
      }}
      mx="auto"
    >
      <UpdateModal opened={opened} setOpened={setOpened} user={user} />
      <Stack spacing={8}>
        <Group position="center">
          <Image
            radius="md"
            src={appUser?.photoURL}
            height={300}
            alt="Photo URL not set or not found :("
            withPlaceholder
            fit="contain"
          />
        </Group>
        <Group position="apart">
          <Text weight={600}>Name: </Text>
          <Text>{appUser?.name ?? "Name is not set yet"}</Text>
        </Group>
        <Group position="apart">
          <Text weight={600}>Email: </Text>
          <Text>{appUser?.email ?? "Email is not set yet"}</Text>
        </Group>
        <Group position="apart">
          <Text weight={600}>Date of birth: </Text>
          <Text>
            {appUser?.DOB?.toDateString() ?? "Date of birth is not set yet"}
          </Text>
        </Group>
        <Divider my="sm" />
        <Button fullWidth variant="outline" onClick={() => setOpened(true)}>
          Update user profile
        </Button>
      </Stack>
    </Box>
  );
};

export default Dashboard;
