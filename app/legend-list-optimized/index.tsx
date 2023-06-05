import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Pressable,
  TextInput,
} from "react-native";
import {
  enableLegendStateReact,
  observer,
  useMount,
} from "@legendapp/state/react";
import React from "react";
import { userModel } from "./user-model";

enableLegendStateReact();

const EmptyList = observer(() => {
  if (userModel.obs.apiStatus.get() === "pending") {
    return <ActivityIndicator />;
  }
  if (userModel.obs.apiStatus.get() === "error") {
    return (
      <View>
        <Text>{"Failed to Load List"}</Text>
        <Pressable>
          <Text>{"Retry"}</Text>
        </Pressable>
      </View>
    );
  }
  return null;
});

const FooterComponent = observer(() => {
  if (
    userModel.obs.data.length > 0 &&
    userModel.obs.apiStatus.get() === "pending"
  ) {
    return <ActivityIndicator />;
  }

  if (
    userModel.obs.data.length > 0 &&
    userModel.obs.apiStatus.get() === "error"
  ) {
    return (
      <View>
        <Text>{"Failed to Load List"}</Text>
        <Pressable>
          <Text>{"Retry"}</Text>
        </Pressable>
      </View>
    );
  }

  return null;
});

const UserItem = observer(({ item, index }) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeftContainer}>
        <Image source={{ uri: item.avatar.get() }} style={styles.avatar} />
        <Text>{item.name.get()}</Text>
      </View>
      <Text>{`Points: ${item.points.get()}`}</Text>
    </View>
  );
});

const SearchInput = observer(() => {
  return (
    <TextInput
      onChangeText={(text) => userModel.obs.search.set(text)}
      style={styles.input}
      placeholder={"Enter text to search"}
    />
  );
});

const UserList = observer(() => {
  const handleEndReached = () => {
    userModel.actions.fetchNextUsers();
  };

  const handleRefresh = () => {
    userModel.actions.refreshUserList();
  };

  return (
    <FlatList
      data={userModel.obs.data}
      extraData={userModel.obs.data}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item, index }) => {
        return <UserItem item={item} index={index} />;
      }}
      ListEmptyComponent={EmptyList}
      ListFooterComponent={FooterComponent}
      onEndReachedThreshold={0.8}
      onEndReached={handleEndReached}
      onRefresh={handleRefresh}
      refreshing={userModel.obs.isRefreshing.get()}
    />
  );
});

const LegendListOptimized = () => {
  useMount(() => {
    userModel.actions.fetchUsers();

    const disposersList = userModel.createListeners();

    return () => {
      disposersList.forEach((disposer) => {
        disposer?.();
      });
    };
  });

  return (
    <View style={styles.container}>
      <SearchInput />
      <UserList />
    </View>
  );
};

export default LegendListOptimized;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    justifyContent: "space-between",
  },
  itemLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    padding: 10,
  },
});
