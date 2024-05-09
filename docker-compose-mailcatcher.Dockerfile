# This is a Dockerfile to build a Docker image for Mailcatcher.
# Hopefully this will ensure that the image is built to the local machine architecture.
FROM yappabe/mailcatcher

CMD ["/run.sh"]
