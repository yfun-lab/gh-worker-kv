# gh-worker-kv

> 将 GitHub 仓库内的 JSON 文件作为 KV 数据库。

优点：解决 Cloudflare KV 免费版每日 1000 次的限制。

缺点： 读取 / 写入速度没有 KV 速度快。（肯定的）

## 限制

GitHub API 限制单 IP，单令牌，一小时 5000 次请求。

## 使用

```js
var db = new ghKV({
    username: "",
    repo: "",
    token: "",
    filename: "",
    branch: "",
});

db.set("cloudflare", "workers"); // true
db.get("cloudflare"); // "workers"
db.delete("cloudflare"); // true
db.get("cloudflare"); // undefinded
```

配置说明：

|   配置名   |             说明              |
| :--------: | :---------------------------: |
| `username` |            用户名             |
|   `repo`   |            仓库名             |
|  `token`   | GitHub 令牌，要求有仓库的权限 |
| `filename` |          JSON 文件名          |
|  `branch`  |         Git 仓库分支          |
