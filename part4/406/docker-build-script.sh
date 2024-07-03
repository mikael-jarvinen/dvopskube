#!/bin/sh

set -e

# Current directory name
DIR_NAME=${PWD##*/}

# Function to build and push Docker images
build_and_push() {
  local context_dir=$1
  local dockerfile=$2
  local image_suffix=$3

  # If a Dockerfile is specified, use it; otherwise, default to Dockerfile in the context directory
  local dockerfile_arg=""
  if [ -n "$dockerfile" ]; then
    dockerfile_arg="-f $dockerfile"
  fi

  # Build and push the Docker image
  (
    cd "$context_dir"
    docker build $dockerfile_arg -t usermine12/dvopskube-$DIR_NAME-$image_suffix .
    docker push usermine12/dvopskube-$DIR_NAME-$image_suffix
  ) &
}

# Build the Docker images for BE, FE, CRONJOB, and broadcaster in parallel
build_and_push "be" "" "backend"
build_and_push "fe" "" "frontend"
build_and_push "be" "Dockerfile_job" "job"
build_and_push "broadcaster" "" "broadcaster"

# Wait for all background processes to finish
wait

echo "Docker images from $DIR_NAME have been built and pushed to Docker Hub."
