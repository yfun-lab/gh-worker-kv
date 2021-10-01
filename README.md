# Cloudflare Workers GitHub KV

> 此版本的 gh-worker-kv 还没有经过 Cloudflare Workers 测试，不能确定可以正常使用。

> 将 GitHub 仓库内的 JSON 文件作为 KV 数据库。

优点：解决 Cloudflare KV 免费版每日 1000 次的限制。

缺点： 读取 / 写入速度没有 KV 速度快。（肯定的）


## 限制

GitHub API 限制单 IP，单令牌，一小时 5000 次请求。


## 已知的问题

- ~~ 有缓存: 目前存在疑问，待解决。~~


## 使用

> gh-worker-kv 仍在开发中，此处的说明将很有可能过时。

```js
async function () {
    // Set
    await ghKV.set("name", "CKY"); // true
    // Get
    await ghKV.get("name"); // "CKY"
    // Delete
    await ghKV.delete("name"); // true
}
```

更改配置：

```js
const ghKV = {
    username: "<USER NAME>",
    repo: "<REPO NAME>",
    token: "<TOKEN>",
    filename: "/config.json",
    branch: "master",
    source: "raw",
    // ...
}
```

## 在未来

gh-worker-kv 还处在开发状态，在未来，将会这样初始化。

```js
const kv = new ghKV({
    username: "",
    // ...
});

kv.set();
kv.get();
kv.delete();
```

这样子可以在单项目中载入多个 ghKV 数据库。