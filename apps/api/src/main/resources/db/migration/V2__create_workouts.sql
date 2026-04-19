CREATE TYPE exercise_type AS ENUM ('squat', 'pushup', 'lunge', 'deadlift');

CREATE TABLE workout_sessions (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_type    exercise_type NOT NULL DEFAULT 'squat',
    rep_count        INTEGER NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    feedback_json    JSONB,
    created_at       TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX idx_workout_sessions_created_at ON workout_sessions(created_at DESC);

