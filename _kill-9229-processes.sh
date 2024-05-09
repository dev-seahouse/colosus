#!/bin/bash

set -e

lsof -i tcp:9229 | awk 'NR>1 {print $2}' | xargs kill -9
