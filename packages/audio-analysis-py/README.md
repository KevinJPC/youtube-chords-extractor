# Audio Analysis Py

This project requires `Python 3.9` and certain packages to be installed. It's necessary to set up a virtual environment to ensure compatibility with the `audio-analyzes-worker` package to run the script.

### Why Two Requirements Files?

Dependencies are managed using `requirements-base.txt` and `requirements.txt` to ensure proper installation order. Dependencies like `numpy` must be installed before others. For instance, `vamp` requires `numpy`; installing `numpy` first in `requirements-base.txt` avoids `ModuleNotFoundError`.

### Vamp Plugins

`/lib/vamp-plugins` includes binaries for `vamp` to run `chordino` on common platforms. For other platforms, download binaries from [Isophonics NNLS Chroma](http://www.isophonics.net/nnls-chroma) and place them in this directory.

## Setup and Installation

1. **Create a virtual environment**: Use Python's built-in `venv` module to create a virtual environment. This helps isolate the dependencies for this project from your global Python environment. **Make sure you run this command with the required python version**.

    ```bash
    python -m venv --copies .venv
    ```

2. **Activate the virtual environment**: Activation steps differ slightly by operating system:
    - On Unix or MacOS:
        ```bash
        source .venv/bin/activate
        ```
    - On Windows:
        ```bash
        .\.venv\Scripts\activate
        ```

3. **Install base dependencies**: First, install dependencies listed in `requirements-base.txt`.

    ```bash
    pip install -r requirements-base.txt
    ```

4. **Install remaining dependencies**: Next, install dependencies listed in `requirements.txt`.

    ```bash
    pip install -r requirements.txt
    ```

## Running the Project

In the virtual environment with dependencies installed, run the main script using:

```bash
python src/main.py [youtube_id]
```
Replace `[youtube_id]` with the actual youtube id.