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

```bash
   namespace.yaml
   deployment.yaml
   service.yaml
   ingress.yaml
   configmap.yaml
   secret.yaml
   hpa.yaml
   pdb.yaml
   pvc.yaml
   serviceaccount.yaml
   role.yaml
   rolebinding.yaml
   networkpolicy.yaml
   job.yaml
   cronjob.yaml
```
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
🧠 What is a Service in Kubernetes?

👉 Service = stable network endpoint to access your Pods

💥 Simple meaning

Pods are temporary, Service gives them a permanent address

🚨 Problem without Service

Pods:

Pod1 → IP: 10.1.1.2
Pod2 → IP: 10.1.1.5

👉 These IPs:

Change anytime ❌
Not stable ❌
✅ Solution: Service

👉 Service gives:

myapp-service → stable IP + DNS
🚀 Enterprise Service.yaml

```bash
apiVersion: v1
kind: Service

metadata:
  name: myapp-service

spec:
  type: NodePort

  selector:
    app: myapp

  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
    nodePort: 30007
```
🔥 Line-by-line explanation
🟢 1️⃣ apiVersion
apiVersion: v1

👉 Service uses core API

🟢 2️⃣ kind
kind: Service

👉 Tells Kubernetes:

“Create a Service”

🟢 3️⃣ metadata
name: myapp-service

👉 Service name

🟡 4️⃣ type (VERY IMPORTANT)
type: NodePort

👉 Defines how app is exposed

🔥 Types of Services
1. ClusterIP (default)

👉 Internal only

Used for: backend communication
2. NodePort

👉 Exposes app via node IP

http://<node-ip>:30007
3. LoadBalancer (cloud)

👉 External IP provided

🟡 5️⃣ selector (VERY IMPORTANT)
selector:
  app: myapp

👉 Connects Service → Pods

⚠️ MUST MATCH Deployment labels
labels:
  app: myapp
🟡 6️⃣ ports (CRITICAL)
ports:
port
port: 80

👉 Service port

targetPort
targetPort: 8080

👉 Container port

nodePort
nodePort: 30007

👉 External port

🔥 Port mapping understanding
User → NodeIP:30007
         ↓
Service:80
         ↓
Pod:8080
🎯 Full flow
User request
   ↓
Service
   ↓
Load balances
   ↓
Pods (multiple)
⚡ Load balancing

👉 Service automatically distributes traffic:

Request 1 → Pod1
Request 2 → Pod2
🧠 Real-world example

You have:

replicas: 3

👉 Service will:

Send traffic to all 3 pods
Balance load
🔥 Why Service is critical

Without Service:
❌ Pods not reachable
❌ No load balancing
❌ No stable endpoint

💥 One-line memory

Service connects users to pods and balances traffic

🎯 Interview killer answer

👉 “What is Service?”

Service is a Kubernetes object that provides a stable network endpoint for accessing pods and performs load balancing across them.

🚀 Important real-world upgrade

👉 In production, we DON’T use NodePort directly ❌

👉 We use:

Ingress
LoadBalancer

🧠 Why it is NOT enterprise?

You saw:

type: NodePort

👉 In real production:

❌ We DON’T expose apps using NodePort
👉 Because:

Not secure
Not scalable
Not user-friendly (port like 30007 😅)
No domain support
🔥 What real enterprise uses instead

👉 Combination of:

ClusterIP Service ✅
Ingress Controller ✅
🏢 ✅ Enterprise-grade Service.yaml

```bash
apiVersion: v1
kind: Service

metadata:
  name: myapp-service

spec:
  type: ClusterIP   # Internal only (BEST PRACTICE)

  selector:
    app: myapp

  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
```
🧠 What changed?

👉 Removed:

nodePort: 30007

👉 Changed:

type: ClusterIP
🎯 Why this is enterprise?

👉 Service is now:

Internal only 🔒
Clean
Secure

👉 External access handled by:
👉 Ingress

🏢 ✅ FINAL ENTERPRISE INGRESS.yaml
```bash
apiVersion: networking.k8s.io/v1
kind: Ingress

metadata:
  name: main-ingress
  namespace: production
  labels:
    app: main-ingress

  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"

spec:
  ingressClassName: nginx

  tls:
  - hosts:
      - app.company.com
      - api.company.com
    secretName: company-tls

  rules:

  # 🔹 Frontend
  - host: app.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80

  # 🔹 Backend
  - host: api.company.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 80
```
🧠 Now understand this simply (no overload)
🎯 What this file does

👉 It says:

app.company.com  → frontend-service
api.company.com  → backend-service
🔥 How traffic flows
User → app.company.com
      ↓
Ingress Controller (NGINX)
      ↓
frontend-service
      ↓
frontend pods
Frontend → calls API (api.company.com)
      ↓
Ingress
      ↓
backend-service
      ↓
backend pods
🟢 Important parts only
✅ ingressClassName
ingressClassName: nginx

👉 Use NGINX controller

✅ TLS (HTTPS)
tls:
  secretName: company-tls

👉 Enables:

https://app.company.com
✅ rules

👉 This is the brain:

host → service
✅ annotations

👉 Controls behavior:

HTTPS redirect
request size
URL rewrite
💥 Why this is “enterprise”

✔ Uses domain-based routing
✔ Supports HTTPS
✔ Handles multiple apps
✔ Clean separation (frontend/backend)
✔ Works with LoadBalancer + Ingress Controller

🧠 Final full architecture
```bash
User (Browser)
     ↓
DNS
     ↓
LoadBalancer
     ↓
Ingress Controller
     ↓
Ingress rules
     ↓
Service
     ↓
Pods
```
