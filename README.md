🚀 Step-by-step Dockerfile mastery plan
🟢 LEVEL 1: Basics (You are here)
👉 You must be able to write this without thinking
Example (Tomcat WAR)
```bash
FROM tomcat:9-jdk17-temurin
RUN rm -rf /usr/local/tomcat/webapps/*
COPY target/app.war /usr/local/tomcat/webapps/ROOT.war
EXPOSE 8080
CMD ["catalina.sh", "run"]
```
🟡 LEVEL 2: Intermediate Dockerfile
👉 Goal: Secure + cleaner than basic
```bash
# Base image (fixed version)
FROM tomcat:9-jdk17-temurin

# Remove default apps (security + clean)
RUN rm -rf /usr/local/tomcat/webapps/*

# Set working directory
WORKDIR /usr/local/tomcat

# Copy WAR file
COPY target/app.war webapps/ROOT.war

# Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Give permission
RUN chown -R appuser:appgroup /usr/local/tomcat

# Switch user
USER appuser

# Environment variable
ENV ENVIRONMENT=production

# Expose port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
```

🧠 What you added here
✔ Non-root user → security
✔ WORKDIR → cleaner structure
✔ ENV → configuration
✔ Clean image → no default apps

🔴 LEVEL 3: Advanced / Enterprise Dockerfile
👉 Goal: Production-ready (optimized + monitored + secure)

```bash
FROM tomcat:9.0.85-jdk17-temurin

LABEL maintainer="Avinash"

ENV CATALINA_HOME=/usr/local/tomcat
ENV PATH=$CATALINA_HOME/bin:$PATH
ENV ENVIRONMENT=production

WORKDIR $CATALINA_HOME

RUN rm -rf webapps/*

RUN groupadd -r appgroup && useradd -r -g appgroup appuser

COPY --chown=appuser:appgroup target/app.war webapps/ROOT.war

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -q --spider http://localhost:8080/ || exit 1

EXPOSE 8080

CMD ["catalina.sh", "run"]
```
🧠 FULL ENTERPRISE FOLDER STRUCTURE
k8s/
 ├── namespace.yaml
 ├── deployment.yaml
 ├── service.yaml
 ├── ingress.yaml
 ├── configmap.yaml
 ├── secret.yaml
 ├── hpa.yaml
 ├── pdb.yaml
 ├── pvc.yaml
 ├── serviceaccount.yaml
 ├── role.yaml
 ├── rolebinding.yaml
 ├── networkpolicy.yaml
 ├── job.yaml
 ├── cronjob.yaml
🎯 MINIMUM vs FULL ENTERPRISE
✅ Minimum (what YOU start with)
Deployment
Service
Ingress
ConfigMap
Secret
🧠 What is Deployment?

👉 In Kubernetes

Deployment = controller that manages your application pods

💥 Simple meaning

Deployment ensures your app is always running, updated, and scalable

🚀 Full Enterprise Deployment.yaml

```bash
apiVersion: apps/v1
kind: Deployment

metadata:
  name: myapp-deployment
  labels:
    app: myapp

spec:
  replicas: 2

  selector:
    matchLabels:
      app: myapp

  template:
    metadata:
      labels:
        app: myapp

    spec:
      containers:
      - name: myapp-container
        image: mydockerhub/myapp:v1
        ports:
        - containerPort: 3000

        resources:
          requests:
            memory: "128Mi"
            cpu: "250m"
          limits:
            memory: "256Mi"
            cpu: "500m"

        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 10

        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```
