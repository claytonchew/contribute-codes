import { sql } from "drizzle-orm";
import { tables, useDB } from "../utils/db";

const main = async () => {
  let { user_version: databaseVersion } = await useDB().get<{
    user_version: number | null;
  }>(sql`PRAGMA user_version`);

  databaseVersion = databaseVersion || 0;

  // eslint-disable-next-line no-console
  console.info(`Current database version: ${databaseVersion}`);

  if (databaseVersion === 0) {
    // eslint-disable-next-line no-console
    console.info("Seeding database for version 0...");

    await useDB().transaction(async (tx) => {
      await tx
        .insert(tables.skill.skill)
        .values([
          // Languages
          { name: "JavaScript" },
          { name: "TypeScript" },
          { name: "Python" },
          { name: "CPython" },
          { name: "Ruby" },
          { name: "PHP" },
          { name: "Java" },
          { name: "C" },
          { name: "C#" },
          { name: "F#" },
          { name: "C++" },
          { name: "Go" },
          { name: "Rust" },
          { name: "Zig" },
          { name: "Swift" },
          { name: "Kotlin" },
          { name: "Objective-C" },
          { name: "Scala" },
          { name: "Perl" },
          { name: "R" },
          { name: "MATLAB" },
          { name: "Lua" },
          { name: "Dart" },
          { name: "Elixir" },
          { name: "Julia" },
          { name: "CoffeeScript" },
          { name: "Crystal" },
          { name: "PowerShell" },
          { name: "Bash/Shell" },
          { name: "Clojure" },
          { name: "Erlang" },
          { name: "Assembly" },
          { name: "WebAssembly" },
          { name: "SQL" },
          { name: "Visual Basic (.NET)" },
          { name: "VBA" },
          { name: "Groovy" },
          { name: "Delphi" },
          { name: "Haskell" },
          { name: "GDScript" },
          { name: "Lisp" },
          { name: "Solidity" },
          { name: "Fortran" },
          { name: "Prolog" },
          { name: "Ada" },
          { name: "OCaml" },
          { name: "Apex" },
          { name: "Cobol" },
          { name: "SAS" },
          { name: "Nim" },
          { name: "APL" },
          { name: "Flow" },
          { name: "Raku" },

          // Web Frameworks
          { name: "React" },
          { name: "Vue" },
          { name: "Nuxt" },
          { name: "Angular" },
          { name: "Svelte" },
          { name: "Next.js" },
          { name: "Gatsby" },
          { name: "Astro" },
          { name: "Tailwind CSS" },
          { name: "Bootstrap" },
          { name: "Bulma" },
          { name: "Material-UI" },
          { name: "Chakra UI" },
          { name: "Nuxt UI" },
          { name: "Shadcn" },

          // Backend Frameworks
          { name: "Node.js" },
          { name: "Express.js" },
          { name: "Django" },
          { name: "Flask" },
          { name: "Ruby on Rails" },
          { name: "Laravel" },
          { name: "CodeIgniter" },
          { name: "Spring Framework" },
          { name: "ASP.NET" },
          { name: "ASP.NET Core" },
          { name: "NestJS" },
          { name: "Koa.js" },
          { name: "FastAPI" },
          { name: "Phoenix" },
          { name: "Meteor" },

          // Databases
          { name: "PostgreSQL" },
          { name: "MySQL" },
          { name: "SQLite" },
          { name: "Redis" },
          { name: "Valkey" },
          { name: "MongoDB" },
          { name: "Cassandra" },
          { name: "DynamoDB" },
          { name: "Firebase" },
          { name: "Supabase" },
          { name: "Oracle" },
          { name: "MariaDB" },
          { name: "BigQuery" },
          { name: "H2" },
          { name: "Cosmos DB" },
          { name: "Snowflake" },
          { name: "InfluxDB" },
          { name: "ElasticSearch" },
          { name: "IBM DB2" },

          // AI & Machine Learning
          { name: "TensorFlow" },
          { name: "PyTorch" },
          { name: "Keras" },
          { name: "Scikit-Learn" },
          { name: "Pandas" },
          { name: "NumPy" },
          { name: "Matplotlib" },
          { name: "OpenCV" },
          { name: "NLTK" },
          { name: "Spacy" },
          { name: "Hugging Face" },
          { name: "FastAI" },
          { name: "XGBoost" },
          { name: "LightGBM" },
          { name: "CatBoost" },
          { name: "DataRobot" },
          { name: "Databricks" },
          { name: "Dataiku" },
          { name: "RapidMiner" },
          { name: "SAS" },
          { name: "Weka" },

          // DevOps & Cloud
          { name: "Docker" },
          { name: "Kubernetes" },
          { name: "AWS" },
          { name: "Azure" },
          { name: "Google Cloud" },
          { name: "Cloudflare" },
          { name: "Terraform" },
          { name: "Ansible" },
          { name: "Jenkins" },
          { name: "GitLab CI" },
          { name: "GitHub Actions" },
          { name: "CircleCI" },
          { name: "Argo" },
          { name: "ArgoCD" },
          { name: "CI/CD" },

          // Testing
          { name: "Jest" },
          { name: "Mocha" },
          { name: "Chai" },
          { name: "Cypress" },
          { name: "Selenium" },
          { name: "Puppeteer" },
          { name: "JUnit" },
          { name: "RSpec" },
          { name: "pytest" },
          { name: "Cucumber" },
          { name: "Vitest" },
          { name: "Playwright" },

          // Mobile Development
          { name: "Expo" },
          { name: "React Native" },
          { name: "Flutter" },
          { name: "SwiftUI" },
          { name: "Xamarin" },
          { name: "Ionic" },
          { name: "Cordova" },

          // APIs & Protocols
          { name: "GraphQL" },
          { name: "REST APIs" },
          { name: "SOAP" },
          { name: "gRPC" },
          { name: "OAuth" },
          { name: "WebSockets" },

          // Other Technologies
          { name: "Redux" },
          { name: "MobX" },
          { name: "RabbitMQ" },
          { name: "Apache Kafka" },
          { name: "Logstash" },
          { name: "Kibana" },
          { name: "Prometheus" },
          { name: "Thanos" },
          { name: "Grafana" },
          { name: "Vagrant" },
          { name: "VirtualBox" },
          { name: "Vercel" },
          { name: "Heroku" },
          { name: "Netlify" },
          { name: "Wordpress" },

          // Other Disciplines
          { name: "Design" },
          { name: "User Interface" },
          { name: "User Experience" },
          { name: "Project Management" },
          { name: "Product Design" },
          { name: "Information Architecture" },
          { name: "Accessibility" },
          { name: "Project Management" },
          { name: "Business Analysis" },
          { name: "DevOps" },
          { name: "Quality Assurance" },
          { name: "Security" },
          { name: "Software Architecture" },
          { name: "Technical Writing" },
          { name: "SEO" },
          { name: "User Research" },
          { name: "Unit Testing" },
          { name: "Usability Testing" },
        ])
        .onConflictDoNothing();

      // update user_version
      await tx.run(sql`PRAGMA user_version = 1`);
      databaseVersion = 1;
    });
  }
};

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    // eslint-disable-next-line no-console
    console.info("Seeding completed!");
    process.exit(0);
  });
