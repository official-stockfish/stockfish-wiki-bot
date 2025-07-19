const Database = require('better-sqlite3');

class VoteManager {
  constructor(dbPath) {
    if (!dbPath) {
      throw new Error("A database path must be provided.");
    }

    this.db = new Database(dbPath, { verbose: null });
    this.db.pragma('journal_mode = WAL');
    this._initDatabase();
  }

  /**
   * Initializes the database by creating the 'votes' table if it doesn't exist.
   * @private
   */
  _initDatabase() {
    const createTableSql = `
      CREATE TABLE IF NOT EXISTS votes (
        voter_id   INTEGER NOT NULL,
        target_id  INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

        -- A user can only vote for another user once.
        PRIMARY KEY (voter_id, target_id),

        -- A user cannot vote for themselves.
        CHECK (voter_id <> target_id)
      );
    `;
    this.db.exec(createTableSql);
  }

  /**
   * Adds or updates a vote from one user to another.
   * If a vote from the voter to the target already exists, it is effectively unchanged.
   * Throws an error if a user tries to vote for themselves.
   * @param {number} voterId The ID of the user casting the vote.
   * @param {number} targetId The ID of the user receiving the vote.
   * @returns {boolean} True if a new vote was added, false otherwise.
   */
  addVote(voterId, targetId) {
    if (voterId === targetId) {
      throw new Error("Users cannot vote for themselves.");
    }

    const sql = 'INSERT OR IGNORE INTO votes (voter_id, target_id) VALUES (?, ?)';
    const stmt = this.db.prepare(sql);
    const info = stmt.run(voterId, targetId);
    return info.changes > 0;
  }

  /**
   * Removes a vote from a user to another.
   * @param {number} voterId The ID of the user who cast the vote.
   * @param {number} targetId The ID of the user who received the vote.
   * @returns {boolean} True if a vote was successfully removed, false if no such vote existed.
   */
  removeVote(voterId, targetId) {
    const sql = 'DELETE FROM votes WHERE voter_id = ? AND target_id = ?';
    const stmt = this.db.prepare(sql);
    const info = stmt.run(voterId, targetId);
    return info.changes > 0;
  }

  /**
   * Gets the total number of votes a user has received.
   * @param {number} targetId The ID of the user.
   * @returns {number} The total vote count for the user.
   */
  getVoteCountForUser(targetId) {
    const sql = 'SELECT COUNT(*) as count FROM votes WHERE target_id = ?';
    const stmt = this.db.prepare(sql);
    const result = stmt.get(targetId);
    return result.count;
  }

  /**
   * Checks if a specific user has voted for another specific user.
   * @param {number} voterId The ID of the potential voter.
   * @param {number} targetId The ID of the potential target.
   * @returns {boolean} True if the voter has voted for the target, false otherwise.
   */
  hasVoted(voterId, targetId) {
    const sql = 'SELECT 1 FROM votes WHERE voter_id = ? AND target_id = ?';
    const stmt = this.db.prepare(sql);
    const result = stmt.get(voterId, targetId);
    return Boolean(result);
  }

  /**
   * Gets a list of all user IDs that a specific user has voted for.
   * @param {number} voterId The ID of the user who cast the votes.
   * @returns {number[]} An array of user IDs.
   */
  getVotesCastByUser(voterId) {
    const sql = 'SELECT target_id FROM votes WHERE voter_id = ?';
    const stmt = this.db.prepare(sql);
    // .all() returns an array of objects, we use .map() to extract the id.
    const rows = stmt.all(voterId);
    return rows.map(row => row.target_id);
  }

  /**
   * Gets a list of the top N users by vote count.
   * @param {number} limit The number of top users to return.
   * @returns {Array<{target_id: number, votes: number}>} An array of objects.
   */
  getLeaderboard(limit = 10) {
    const sql = `
      SELECT target_id, COUNT(voter_id) as votes
      FROM votes
      GROUP BY target_id
      ORDER BY votes DESC
      LIMIT ?
    `;
    const stmt = this.db.prepare(sql);
    return stmt.all(limit);
  }

  /**
   * Closes the database connection.
   * It's important to call this when the application is shutting down.
   */
  close() {
    this.db.close();
    console.log("Database connection closed.");
  }
}

const instance = new VoteManager('votes.db');

module.exports = instance;
