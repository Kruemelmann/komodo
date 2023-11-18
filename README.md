# komodo
![build status](https://github.com/kruemelmann/komodo/actions/workflows/workflow.yml/badge.svg)
![release status](https://github.com/kruemelmann/komodo/actions/workflows/release.yml/badge.svg)

Komodo is small command line tool for latex writing from the console.

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
sudo curl -L "https://github.com/kruemelmann/komodo/releases/download/v0.1.18/komodo-$(uname -s)-$(uname -m)" -o /usr/local/bin/komodo && sudo chmod +x /usr/local/bin/komodo
```

## Usage

### Simply build pdf from LaTex File
```bash
komodo build -f <filename>.tex
```

### Build pdf from LaTex with a watcher
(You dont need to run the script everytime you change the tex-File)
```bash
komodo build -f <filename>.tex -w
```

### Build pdf (with watcher) and serve it to your browser
(The ui has hot reload of course otherwise the watcher in the backend would be useless)
```bash
komodo serve -f <filename>.tex
```

## Supported platforms

At the moment I only support x86 or ARM based Mac or x86 Linux in komodo but if you want to use another platform and can't build komodo from source you can open an issue and I will integrate a build for your preferred platform in the CI pipeline.


## Contributing

Pull requests welcome:)
If you like to do some bigger changes please open an issue, so we can chat about.

## Authors

* kruemelmann - [@kruemelmann](https://github.com/kruemelmann/)

## License
[MIT](https://choosealicense.com/licenses/mit/)

