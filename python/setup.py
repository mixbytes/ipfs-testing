#!python3

import sys
if sys.version_info < (3, 5):
    sys.exit('Sorry, Python < 3.5 is not supported')

from setuptools import setup, find_packages

setup(
    name='ipfs-test-python',
    description='test',
    author='Boogerwooger',
    author_email='sergey.prilutskiy@smartz.io',
    url='https://github.com/mixbytes/smartz-ipfs-test',
    version='0.0.1',
    packages=find_packages(exclude=["*tests"]),
    scripts=['bin/testnode']
)
