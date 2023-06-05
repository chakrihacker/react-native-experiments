import {
  batch,
  beginBatch,
  endBatch,
  observable,
  observe,
} from "@legendapp/state";
import { debounce } from "lodash";

const PAGE_SIZE = 15;

class UserModel {
  obs;

  constructor() {
    this.obs = observable({
      // Local
      pageSize: PAGE_SIZE,
      pageNumber: 1,
      search: "",
      filters: [],
      hasEndReached: false, // This can be BE determined, the MockAPI doesn't have that support
      // Remote
      apiStatus: "init",
      isRefreshing: false,
      data: [],
      error: undefined,
      abortController: undefined,
    });
  }

  fetchUsers = async () => {
    try {
      let { pageNumber, pageSize, isRefreshing, filters, search, apiStatus } =
        this.obs.peek();

      // Pull to Refresh has highest priority so stop any existing api calls, and fetch first page
      if (isRefreshing) {
        this.obs.abortController.peek()?.abort();
        pageNumber = 1;
      }

      // Complete existing Api call, before new Api is made for pagination
      if (!isRefreshing && apiStatus === "pending") {
        return;
      }

      const controller = new AbortController();
      batch(() => {
        this.obs.apiStatus.set("pending");
        this.obs.abortController.set(controller);
      });

      let url = `https://643fef28b9e6d064be03080d.mockapi.io/fyndx/users?limit=${pageSize}&page=${pageNumber}&search=${search}`;

      console.log({ url });
      const usersResponse = await fetch(url, { signal: controller.signal });
      const users = await usersResponse.json();

      beginBatch();
      this.obs.isRefreshing.set(false);
      this.obs.abortController.set(undefined);

      if (usersResponse.ok) {
        // console.log({ users });
        this.obs.apiStatus.set("success");
        // Figuring out the end of list as Mock API doesn't have a better way
        this.obs.hasEndReached.set(users.length === 0);
        // if pageNumber is 1 it's either first time load or pull to refresh
        if (pageNumber === 1) {
          this.obs.data.set(users);
        } else {
          this.obs.data.set([...this.obs.data.peek(), ...users]);
        }
        this.obs.pageNumber.set(pageNumber + 1);
      } else {
        this.obs.apiStatus.set("error");
        // console.log({ usersResponse });
        this.obs.error.set({
          title: "Failed to get users",
          message: usersResponse.statusText,
        });
      }
      endBatch();
    } catch (error) {
      console.log({ error });
      this.obs.apiStatus.set("error");
    }
  };

  refreshUserList = () => {
    if (this.obs.data.peek().length > 0) {
      this.obs.isRefreshing.set(true);
      this.fetchUsers();
    }
  };

  getUserListBasedOnSearch = () => {
    this.obs.isRefreshing.set(true);
    this.fetchUsers();
  };

  fetchNextUsers = () => {
    if (this.obs.data.peek().length > 0 && !this.obs.hasEndReached.peek()) {
      this.fetchUsers();
    }
  };

  actions = {
    fetchUsers: debounce(this.fetchUsers, 250),
    refreshUserList: debounce(this.refreshUserList, 250),
    fetchNextUsers: debounce(this.fetchNextUsers, 250),
    getUserListBasedOnSearch: debounce(this.getUserListBasedOnSearch, 250),
  };

  createListeners = () => {
    const textInputDisposer = observe(this.obs.search, (e) => {
      // Whenever the search input changes, we need to fetch fresh list from page 1
      this.actions.getUserListBasedOnSearch();
    });

    return [textInputDisposer];
  };
}

export const userModel = new UserModel();
