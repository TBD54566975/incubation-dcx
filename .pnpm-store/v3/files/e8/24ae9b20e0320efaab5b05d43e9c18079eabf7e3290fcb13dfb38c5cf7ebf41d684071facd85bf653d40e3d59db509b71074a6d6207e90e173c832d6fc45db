import { decode } from '@ipld/dag-pb';
import map from 'it-map';
import parallel from 'it-parallel';
import { pipe } from 'it-pipe';
import { CustomProgressEvent } from 'progress-events';
const hamtShardedDirectoryContent = (cid, node, unixfs, path, resolve, depth, blockstore) => {
    function yieldHamtDirectoryContent(options = {}) {
        options.onProgress?.(new CustomProgressEvent('unixfs:exporter:walk:hamt-sharded-directory', {
            cid
        }));
        return listDirectory(node, path, resolve, depth, blockstore, options);
    }
    return yieldHamtDirectoryContent;
};
async function* listDirectory(node, path, resolve, depth, blockstore, options) {
    const links = node.Links;
    const results = pipe(links, source => map(source, link => {
        return async () => {
            const name = link.Name != null ? link.Name.substring(2) : null;
            if (name != null && name !== '') {
                const result = await resolve(link.Hash, name, `${path}/${name}`, [], depth + 1, blockstore, options);
                return { entries: result.entry == null ? [] : [result.entry] };
            }
            else {
                // descend into subshard
                const block = await blockstore.get(link.Hash, options);
                node = decode(block);
                options.onProgress?.(new CustomProgressEvent('unixfs:exporter:walk:hamt-sharded-directory', {
                    cid: link.Hash
                }));
                return { entries: listDirectory(node, path, resolve, depth, blockstore, options) };
            }
        };
    }), source => parallel(source, { ordered: true }));
    for await (const { entries } of results) {
        yield* entries;
    }
}
export default hamtShardedDirectoryContent;
//# sourceMappingURL=hamt-sharded-directory.js.map