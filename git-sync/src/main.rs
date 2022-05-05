use std::env;
use std::process::Command;

fn main() {
    let args: Vec<String> = env::args().collect();
    let mut git = Command::new("git");
    let current = env::current_dir();
    git.current_dir(current.expect("shit").to_str().expect("asd"));

    git.current_dir(".");

    let output_current = git
        .args(["branch", "--show-current"])
        .output()
        .expect("Failed to checkout master")
        .stdout;
    let branch = std::str::from_utf8(&output_current)
        .expect("Failed to checkout master")
        .trim();
    let main = &args[1];

    Command::new("git")
        .args(["checkout", main])
        .status()
        .expect("Failed to checkout master");

    Command::new("git")
        .arg("pull")
        .status()
        .expect("Failed to pull master");

    Command::new("git")
        .args(["checkout", branch])
        .status()
        .expect("Failed to checkout branch");

    Command::new("git")
        .args(["rebase", main])
        .status()
        .expect("Failed to rebase");
}
