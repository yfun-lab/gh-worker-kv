/**
 * Cloudflare Workers GitHub KV
 * Use JSON file in GitHub repository as KV database.
 * Use GitHub API, need GitHub access token (repo*).
 * Author: YFun (@oCoke)
 */

var ghKV = function (global_config) {
    /* 设置配置信息 */
    try {
        this.username = global_config["username"];
        this.repo = global_config["repo"];
        this.token = global_config["token"];
        this.filename = global_config["filename"];
        this.branch = global_config["branch"];
    } catch (e) {}
};

ghKV.prototype.log = function () {
    console.log("Database loaded. Use `new ghKV()` to init.");
};
/**
 * Get (获取)
 * @param {string} key 键
 * @returns {*} 值
 */
ghKV.prototype.get = async function (key) {
    // 检查传入的信息是否完整
    if (!this.token || !this.filename || !this.branch) {
        console.error(
            "[Error] Please Check the Config. (token/filename/branch)"
        );
        return false;
    }
    if (!key) {
        console.error("[Error] Please Check the key.");
        return false;
    }
    // 拼接为获取文件的链接
    let url = encodeURI(
        `https://raw.githubusercontent.com/${this.username}/${this.repo}/${
            this.branch
        }${this.filename}?dt=${Math.floor(Math.random() * 100000000)}`
    );
    let value = await fetch(url, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${this.token}`,
        },
    });
    // 对 JSON 文件进行处理
    let dtb = await value.json();
    // 返回值
    return dtb[key];
};

/**
 * Set (修改 / 设置)
 * @param {string} key 键
 * @param {string} value 值
 * @returns {boolean} 状态
 */
ghKV.prototype.set = async function (key, value) {
    // 获取文件信息
    let fileAPI = await fetch(
        `https://api.github.com/repos/${this.username}/${this.repo}/contents/${this.filename}?ref=${this.branch}`,
        {
            method: "GET",
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "user-agent": "ghKV Client",
                Authorization: "token " + this.token,
            },
        }
    );
    // 得到文件 sha 值
    let fileJSON = await fileAPI.json();
    let dbsha = fileJSON["sha"];
    // 生成一个随机数，防止缓存
    let getDBurl = encodeURI(
        `https://raw.githubusercontent.com/${this.username}/${this.repo}/${
            this.branch
        }${this.filename}?dt=${Math.floor(Math.random() * 100000000)}`
    );
    let getDB = await fetch(getDBurl, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${this.token}`,
        },
    });
    var dbContent = JSON.parse(await getDB.text());
    dbContent[key] = value;
    dbContent = JSON.stringify(dbContent);
    // 推送配置信息
    let cfg = {
        body: JSON.stringify({
            branch: this.branch,
            message: "Upload Database by this.",
            content: Base64.encode(dbContent),
            sha: dbsha,
        }),
        method: "PUT",
        headers: {
            accept: "application/vnd.github.v3+json",
            "content-type": "application/json;charset=UTF-8",
            "user-agent": "ghKV Client",
            Authorization: "token " + this.token,
        },
    };

    // 发送请求
    let putC = await fetch(
        `https://api.github.com/repos/${this.username}/${this.repo}/contents${this.filename}?ref=${this.branch}`,
        cfg
    );
    // 返回 状态值
    if (putC["status"] == 200 || putC["status"] == 201) {
        return true;
    } else {
        return false;
    }
};

/**
 * Delete (删除)
 * @param {string} key 删除的键
 * @returns {boolean} 状态
 */
ghKV.prototype.delete = async function (key) {
    // 获取文件信息
    let fileAPI = await fetch(
        `https://api.github.com/repos/${this.username}/${this.repo}/contents/${this.filename}?ref=${this.branch}`,
        {
            method: "GET",
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "user-agent": "ghKV Client",
                Authorization: "token " + this.token,
            },
        }
    );
    // 获取文件 sha 值
    let fileJSON = await fileAPI.json();
    let dbsha = fileJSON["sha"];
    let getDBurl = encodeURI(
        `https://raw.githubusercontent.com/${this.username}/${this.repo}/${
            this.branch
        }${this.filename}?dt=${Math.floor(Math.random() * 100000000)}`
    );
    let getDB = await fetch(getDBurl, {
        headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${this.token}`,
        },
    });
    var dbContent = JSON.parse(await getDB.text());
    delete dbContent[key];
    dbContent = JSON.stringify(dbContent);
    // 请求配置
    let cfg = {
        body: JSON.stringify({
            branch: this.branch,
            message: "Upload Database by ghKV.",
            content: Base64.encode(dbContent),
            sha: dbsha,
        }),
        method: "PUT",
        headers: {
            accept: "application/vnd.github.v3+json",
            "content-type": "application/json;charset=UTF-8",
            "user-agent": "ghKV Client",
            Authorization: "token " + this.token,
        },
    };

    // 发送请求
    let putC = await fetch(
        `https://api.github.com/repos/${this.username}/${this.repo}/contents${this.filename}?ref=${this.branch}`,
        cfg
    );
    // 返回状态
    if (putC["status"] == 200 || putC["status"] == 201) {
        return true;
    } else {
        return false;
    }
};
