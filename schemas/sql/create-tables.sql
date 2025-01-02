-- The kind of the session should be restricted as one of: 'checkout' or 'identity'
CREATE TYPE session_kind AS ENUM('checkout', 'identity');

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(128) NOT NULL UNIQUE PRIMARY KEY,
  identity TEXT NULL,
  kind session_kind NOT NULL,
  payload TEXT NOT NULL,
  signature TEXT NOT NULL,
  expires_at TIMESTAMP WITHOUT TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  event_id VARCHAR(128) NOT NULL UNIQUE PRIMARY KEY,
  event_type VARCHAR(255) NOT NULL,
  sequence SERIAL NOT NULL,
  originator TEXT NOT NULL,
  payload TEXT NOT NULL,
  dispatched_at TIMESTAMP WITH TIME ZONE NOT NULL
);


-- Indexes for sessions table
CREATE INDEX idx_sessions_identity ON sessions(identity);
CREATE INDEX idx_sessions_kind ON sessions(kind);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_updated_at ON sessions(updated_at);

-- Indexes for events table
CREATE INDEX idx_events_event_type ON events(event_type);
CREATE INDEX idx_events_originator ON events(originator);
CREATE INDEX idx_events_dispatched_at ON events(dispatched_at);


-- Views for quick analysis and reporting
-- View for active sessions (not expired)
CREATE VIEW active_sessions AS
  SELECT
    *
  FROM
    sessions
WHERE
  expires_at IS NULL
OR
  expires_at > NOW();

-- View for recent events (last 7 days)
CREATE VIEW recent_events AS
  SELECT
    *
  FROM
    events
  WHERE
    dispatched_at >= NOW() - INTERVAL '7 days';

-- View for sessions by kind
CREATE VIEW sessions_by_kind AS
  SELECT
    kind,
    COUNT(*) as count
  FROM
    sessions
  GROUP BY
    kind;

-- View for events by type
CREATE VIEW events_by_type AS
  SELECT
    event_type,
    COUNT(*) as count
  FROM
    events
  GROUP BY
    event_type;
