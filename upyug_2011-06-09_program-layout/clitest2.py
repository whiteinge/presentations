if __name__ == '__main__':
    import clitest2
    raise SystemExit(clitest2.main())

import sys

def main():
    print >> sys.stdout, "My name is %s" % __name__

