use cli_clipboard;
use std::process::Command;

use clap::Parser;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    container: String,
}

fn main() {
    let args = Args::parse();

    let output = Command::new("docker")
        .args(["port", &args.container])
        .output()
        .expect("failed to execute process");

    if let Some(port) = String::from_utf8_lossy(&output.stdout).split(":").nth(1) {
        let port = port.trim();
        cli_clipboard::set_contents(port.trim().to_owned()).unwrap();
        println!("Copied {:?} to the clipboard", port);
    }
}
