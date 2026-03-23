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
🏢 ✅ FINAL ENTERPRISE ConfigMap.yaml

```bash
apiVersion: v1
kind: ConfigMap

metadata:
  name: myapp-config
  namespace: production
  labels:
    app: myapp
    environment: production

data:
  # 🔹 Frontend config
  API_URL: "https://api.company.com"

  # 🔹 Backend config
  DB_HOST: "mysql-service"
  DB_PORT: "3306"

  # 🔹 App environment
  ENV: "production"
  LOG_LEVEL: "INFO"

  # 🔹 Feature flags (real enterprise use)
  ENABLE_CACHE: "true"
  ENABLE_METRICS: "true"
```
🧠 Now understand ONLY what matters
🎯 What this file is

👉 Just a storage of key-value pairs

KEY → VALUE
🔥 Example from above
API_URL → https://api.company.com
DB_HOST → mysql-service
🧩 How it is USED (MOST IMPORTANT)

👉 Inside Deployment.yaml:

envFrom:
- configMapRef:
    name: myapp-config
🎯 What happens after this

Inside your container:

API_URL=https://api.company.com
DB_HOST=mysql-service
ENV=production

👉 Your app reads this

🧠 Real flow (final clarity)
ConfigMap.yaml
      ↓
Deployment.yaml
      ↓
Container ENV variables
      ↓
Application uses it
💥 Why this is “enterprise”

✔ Namespace used
✔ Labels added
✔ Separate frontend/backend config
✔ Feature flags included
✔ Clean structure

⚠️ VERY IMPORTANT RULE

❌ Don’t put this here:

passwords
tokens
API keys

👉 That goes in Secret.yaml

🧠 One-line memory

ConfigMap = external config injected into container as environment variables

🚀 You’re now aligned with production level

You now have:

✔ Deployment
✔ Service
✔ Ingress
✔ ConfigMap

🔥 Next step (VERY IMPORTANT)

Now comes:

👉 Secret.yaml (same concept, but for passwords + TLS)

🧠 First: What is Secret?

👉 Same as ConfigMap… BUT for sensitive data

❌ ConfigMap stores
API_URL ✅
ENV ✅
LOG_LEVEL ✅
✅ Secret stores
DB_PASSWORD 🔐
API_KEY 🔐
TOKEN 🔐
TLS CERT 🔐
🎯 Simple meaning

Secret = secure key-value storage for sensitive data

🏢 ✅ ENTERPRISE Secret.yaml

```bash
apiVersion: v1
kind: Secret

metadata:
  name: myapp-secret
  namespace: production
  labels:
    app: myapp

type: Opaque

data:
  DB_USERNAME: YWRtaW4=
  DB_PASSWORD: cGFzc3dvcmQxMjM=
```
🧠 What is this strange value? 😅
DB_PASSWORD: cGFzc3dvcmQxMjM=

👉 This is base64 encoded

🔥 Example
echo -n "password123" | base64

👉 Output:

cGFzc3dvcmQxMjM=
⚠️ Important

👉 Base64 is NOT encryption ❌
👉 Just encoding

🧩 Step 2: Use Secret in Deployment
🔹 Method 1 (recommended)
envFrom:
- secretRef:
    name: myapp-secret
🔹 Method 2 (specific key)
env:
- name: DB_PASSWORD
  valueFrom:
    secretKeyRef:
      name: myapp-secret
      key: DB_PASSWORD
🎯 What happens inside container
printenv

👉 Output:

DB_USERNAME=admin
DB_PASSWORD=password123
🔥 Full flow (same as ConfigMap)
Secret.yaml
     ↓
Deployment.yaml
     ↓
Pod (env variables)
     ↓
Application uses it
🧠 Real example (your backend)
Backend needs:
DB_USERNAME
DB_PASSWORD
Secret stores it

👉 Deployment injects it
👉 Backend connects DB

🔥 ConfigMap vs Secret (clear difference)
Feature	ConfigMap	Secret
Data type	Normal	Sensitive
Encoding	Plain	Base64
Use case	URL, ENV	Password, Token
⚠️ Important rules
❌ Don’t put secrets in ConfigMap
DB_PASSWORD ❌
❌ Don’t hardcode in code
const password = "123456"; ❌
✅ Always use Secret
💥 One-line memory

Secret = secure config injected into container

🚀 Final clarity

👉 Same flow as ConfigMap
👉 Only difference = sensitive data

🔥 Now your Kubernetes core is almost complete

You now know:

✔ Deployment
✔ Service
✔ Ingress
✔ ConfigMap
✔ Secret

I’ll explain PVC.yaml clearly without confusion.

🧠 First: Why do we need PVC?

👉 Problem:

Pod deleted → data lost ❌

👉 Example:

Database pod restarts → all data gone 😨
✅ Solution

👉 Use Persistent Storage

🧩 3 components (IMPORTANT)
PV  → actual storage (disk)
PVC → request for storage
Pod → uses storage
🎯 Simple meaning

PVC = “I need 10GB storage” request to Kubernetes

🏢 ✅ ENTERPRISE PVC.yaml
```bash
apiVersion: v1
kind: PersistentVolumeClaim

metadata:
  name: mysql-pvc
  namespace: production

spec:
  accessModes:
    - ReadWriteOnce

  resources:
    requests:
      storage: 10Gi

  storageClassName: standard

```
🧠 Now understand clearly
🟢 1️⃣ kind
PersistentVolumeClaim

👉 This is a storage request

🟢 2️⃣ storage request
storage: 10Gi

👉 Asking for:

10 GB storage
🟢 3️⃣ accessModes
ReadWriteOnce

👉 Means:

One pod can use it at a time
🟢 4️⃣ storageClassName
standard

👉 Defines:

Type of storage (EBS, SSD, etc.)
🔥 What happens after applying PVC
PVC created
     ↓
Kubernetes finds PV (or creates dynamically)
     ↓
PVC gets storage
🚀 Step 2: Use PVC in Deployment
Example (MySQL pod)
volumeMounts:
- mountPath: /var/lib/mysql
  name: mysql-storage

volumes:
- name: mysql-storage
  persistentVolumeClaim:
    claimName: mysql-pvc
🎯 What happens now
Pod writes data → /var/lib/mysql
        ↓
Stored in persistent disk
        ↓
Pod deleted → data still exists ✅
🧠 Full flow
PVC → gets storage
      ↓
Pod mounts it
      ↓
Data persists
💥 Real-world example

👉 Backend DB:

MySQL pod
   ↓
Uses PVC
   ↓
Data safe even after restart
⚠️ Important concepts
❌ Without PVC
Pod restart → data lost ❌
✅ With PVC
Pod restart → data safe ✅
🧠 One-line memory

PVC = request storage and attach it to pod

🚀 Final clarity

You now know:

✔ Deployment → runs app
✔ Service → connects
✔ Ingress → exposes
✔ ConfigMap → config
✔ Secret → secure data
✔ HPA → scaling
✔ PVC → storage
