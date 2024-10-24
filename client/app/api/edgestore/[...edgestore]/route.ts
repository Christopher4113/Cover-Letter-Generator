
import {initEdgeStore} from "@edgestore/server";
import {createEdgeStoreNextHandler} from "@edgestore/server/adapters/next/app"

const es = initEdgeStore.create();

const edgeStoreRouter = es.router({
    myPublicFiles: es.fileBucket({
        maxSize: 1024 * 1024 * 1, // 1MB
        accept: ["application/pdf"],
      }),
});
const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
});
export {handler as GET, handler as POST};

export type EdgeStoreRouter = typeof edgeStoreRouter
