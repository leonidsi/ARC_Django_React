FROM python:3.6-alpine

ARG PIPENV_DEV
ARG SECRET_KEY
ENV SECRET_KEY ${SECRET_KEY}
ENV PIPENV_DEV ${PIPENV_DEV:-1}
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src/app
COPY Pipfile Pipfile.lock ./

# hadolint ignore=DL3013
RUN pip --no-cache-dir install --upgrade pip \
  && pip --no-cache-dir install pipenv

# hadolint ignore=DL3018
RUN apk add --no-cache build-base \
  && apk add --no-cache --virtual pillow-build-dependencies \
        jpeg-dev \
        zlib-dev \
        freetype-dev \
        lcms2-dev \
        openjpeg-dev \
        tiff-dev \
        tk-dev \
        tcl-dev \
        harfbuzz-dev \
        fribidi-dev \
  \
  # Install psycopg2 build dependencies
  && apk add --no-cache --virtual psycopg2-build-dependencies \
        postgresql-dev \
  \
  # Install lxml build dependencies
  && apk add --no-cache --virtual lxml-build-dependencies \
        libxml2-dev \
        libxslt-dev \
  \
  # Install xmlsec build dependencies
  && apk add --no-cache --virtual xmlsec-build-dependencies \
        xmlsec-dev \
  \
  # Install smartsheet dependencies
  && pipenv install --system --deploy \
  \
  # Delete build-dependencies
  && apk del build-base \
  && apk del lxml-build-dependencies \
  && apk del xmlsec-build-dependencies \
  && apk del pillow-build-dependencies \
  && apk del psycopg2-build-dependencies \
  \
  # Install runtime dependencies for pillow
  && apk add --no-cache libjpeg-turbo \
                        openjpeg \
                        tiff \
  \
  # Install runtime dependencies for psycopg2
  && apk add --no-cache libpq

COPY . ./

# This will copy all files from your static
# folders into the STATIC_ROOT directory.
RUN python manage.py collectstatic --noinput

CMD [ "gunicorn", "--workers=4", "--worker-class=gevent", "--bind=0.0.0.0:8000", "smartsheets_api.wsgi:application" ]
