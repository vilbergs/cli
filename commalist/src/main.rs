use arboard::Clipboard;
use clap::Parser;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Name of the person to greet
    list: String,
}

fn main() {
    let args = Args::parse();
    let mut clipboard = Clipboard::new().unwrap();

    let list = args
        .list
        .split(",")
        .map(|i| i.trim())
        .collect::<Vec<&str>>()
        .join("\n");

    println!("===========================");
    println!("{}", list);
    println!("===========================");
    println!("=== Copied to clipboard ===");
    println!("===========================");

    clipboard.set_text(list).unwrap();
}
