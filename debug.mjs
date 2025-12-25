import blogSlice from "./src/store/blogSlice"; console.log("POSTS:", JSON.stringify(blogSlice.getInitialState ? blogSlice.getInitialState().posts : blogSlice.initialState?.posts));
