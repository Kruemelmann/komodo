# komodo

Komodo is small command line tool for latex writing from the console.

---
*NOTE

Blog post is coming soon:)

---
## TODOs
* save scroll position
* fe and be are both building with bazel (what is left is to embed the build output of the frontend directly into the backend build)
    * some kind of depend?

## Requirements

Before you can start using komodo you need to install:
* pdflatex

    Linux
    ```bash
    sudo apt-get install texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra
    ```
    Mac
    ```bash
    brew install basictex
    ```


## Installation

```bash
sudo curl -L "https://github.com/kruemelmann/komodo/releases/download/v0.1.8/komodo-$(uname -s)-$(uname -m)" -o /usr/local/bin/komodo
```

```bash
sudo chmod +x /usr/local/bin/komodo
```

## Usage


## Contributing

Pull requests welcome:)
If you like to do some bigger changes please open an issue, so we can chat about.

## Authors

* kruemelmann - [@kruemelmann](https://github.com/kruemelmann/)

## License
[MIT](https://choosealicense.com/licenses/mit/)

