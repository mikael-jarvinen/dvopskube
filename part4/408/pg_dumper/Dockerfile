FROM google/cloud-sdk:alpine

ADD setup.sh setup.sh
RUN sh setup.sh && rm setup.sh

# Postgres Environment
ENV POSTGRES_DATABASE **None**
ENV POSTGRES_HOST **None**
ENV POSTGRES_PORT 5432
ENV POSTGRES_USER **None**
ENV POSTGRES_PASSWORD **None**
ENV POSTGRES_EXTRA_OPTS ''

# GCS Environment
ENV GCLOUD_KEYFILE_BASE64 **None**
ENV GCLOUD_PROJECT_ID **None**
ENV GCS_BACKUP_BUCKET **None**

ADD backup.sh backup.sh

CMD ["sh", "backup.sh"]
