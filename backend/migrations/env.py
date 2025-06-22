# migrations/env.py

import os, asyncio
from logging.config import fileConfig

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context
from dotenv import load_dotenv

# 1) load your .env (so os.getenv() works)
load_dotenv()

database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise RuntimeError("DATABASE_URL must be set in your environment")
context.config.set_main_option("sqlalchemy.url", database_url)

# 2) grab the alembic config and set up logging
config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name)

# 3) point at your metadata
import app.models
from app.db.base import Base
target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection):
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    # build an async engine (using the asyncpg URL from alembic.ini)
    sqlalchemy_url = config.get_main_option("sqlalchemy.url")
    if sqlalchemy_url is None:
        raise RuntimeError("sqlalchemy.url is not set in the Alembic configuration.")
    connectable = create_async_engine(
        sqlalchemy_url,
        poolclass=pool.NullPool,
    )

    async def _runner():
        async with connectable.connect() as conn:
            # run the sync migration script in this connection
            await conn.run_sync(do_run_migrations)
        await connectable.dispose()

    # drive the async coroutine to completion
    asyncio.run(_runner())

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
