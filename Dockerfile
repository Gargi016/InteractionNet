FROM continuumio/miniconda3

# Create conda environment and install rdkit
RUN conda create -y -n myenv python=3.11 rdkit=2023.03.3 -c rdkit -c conda-forge

# Activate env
SHELL ["conda", "run", "-n", "myenv", "/bin/bash", "-c"]

# Copy project files
WORKDIR /app
COPY . .

# Install pip packages inside conda env
RUN pip install --no-cache-dir -r requirements.txt

# Expose port for Render
EXPOSE 10000

# Start Flask with gunicorn
CMD ["conda", "run", "--no-capture-output", "-n", "myenv", "gunicorn", "-b", "0.0.0.0:10000", "app:app"]
