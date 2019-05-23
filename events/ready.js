module.exports = (client) => {

    //start stats
    console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`);

    //create table if it does not exist
    const SQLite = require("better-sqlite3");
    const sql = new SQLite('./investments.sqlite');
    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table' AND name = 'investments';").get();
    if (!table['count(*)']) {
        sql.prepare("CREATE TABLE investments (uID TEXT PRIMARY KEY, id TEXT, symbol TEXT, shares INTEGER);").run();
        sql.pragma("synchronous = 1");
        sql.pragma("journal_mode = wal");
    }
}
