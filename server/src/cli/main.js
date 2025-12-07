#!/usr/bin/env node

import dotenv from "dotenv";
import chalk from "chalk";
import figlet from "figlet";



import {Command} from "commander";
import { login, logout, whoami} from "./commands/auth/login.js";


dotenv.config();

async function main() {
    // Display Banner
    console.log(
        chalk.cyan(
            figlet.textSync("Orbital CLI", {
                font: "Standard",
                horizontalLayout: "default",
                
            })
        )
    );

    console.log(chalk.red("A CLI based AI Tool\n"));
    const program = new Command("orbitals");

    program.version("0.0.1")
    .description("Orbital CLI - A Cli Based AI Tool")
    .addCommand(login)
     .addCommand(logout)
     .addCommand(whoami)

    // Default action shows help
    program.action(() => {
        program.help();
    });

  program.parse()
}

main().catch((err)=>{
    console.log(chalk.red("Error running orbital CLI:"),err)
    process.exit(1)
})