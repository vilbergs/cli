use std::{any::Any, fmt::Display, io, process, str::FromStr};

use anyhow::Result;
use chrono::{DateTime, NaiveDateTime};
use clap::{Parser, command};
use comfy_table::{
    Cell, CellAlignment, Color, ContentArrangement, Table, modifiers::UTF8_ROUND_CORNERS,
    presets::UTF8_FULL,
};
use serde::Deserialize;
use serde_json::{Map, Value};
use std::{
    io::{BufRead, BufReader, IsTerminal, stdin},
    path::PathBuf,
};

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(version, about, long_about = None)]
struct Args {
    #[clap(default_missing_value = "")]
    input: Option<String>,
}

#[derive(Deserialize)]
struct Input(Value);

impl Input {
    pub fn data(&self) -> Result<Vec<Map<String, Value>>, Error> {
        let data = match self.0.as_array() {
            Some(data) => Ok(data),
            None => Err(Error::ValidationError("Input must be a JSON array".into())),
        }?;

        if !data.iter().all(|v| v.is_object()) {
            return Err(Error::ValidationError("Input must be a JSON array".into()));
        }

        Ok(data
            .iter()
            .filter_map(|data| data.as_object().cloned())
            .collect())
    }
}

impl FromStr for Input {
    type Err = Error;

    fn from_str(s: &str) -> Result<Self, Error> {
        serde_json::from_str(s).map_err(|err| Error::ParseError(err.to_string()))
    }
}

#[derive(Debug)]
enum Error {
    ParseError(String),
    ValidationError(String),
}

impl Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Error::ParseError(msg) => write!(f, "Parse error: {}", msg),
            Error::ValidationError(msg) => write!(f, "Validation error: {}", msg),
        }
    }
}

impl std::error::Error for Error {}

fn main() -> Result<(), Error> {
    let args = Args::parse();

    let input_str = match args.input {
        Some(i) => i,
        None => {
            let mut line = String::new();
            let stdin = io::stdin();

            stdin.lock().read_line(&mut line).unwrap();

            line
        }
    };

    if input_str.len() == 0 {
        return Err(Error::ParseError("Input cannot be empty".into()));
    }

    let input = Input::from_str(&input_str)?;

    let data = input.data()?;

    let header: Vec<&String> = if let Some(header) = data.first() {
        header.keys().collect()
    } else {
        return Err(Error::ValidationError("Input array is empty".into()));
    };

    let mut table = Table::new();

    table
        .load_preset(UTF8_FULL)
        .apply_modifier(UTF8_ROUND_CORNERS)
        .set_content_arrangement(ContentArrangement::Dynamic)
        .set_header(header);

    let rows: Vec<Vec<Cell>> = data
        .iter()
        .map(|row| {
            row.values()
                .map(|v| {
                    let cell = match v {
                        Value::String(str) => {
                            let color = if str.parse::<f64>().is_ok() {
                                Color::Yellow
                            } else {
                                Color::Green
                            };

                            Cell::from(str).fg(color)
                        }
                        Value::Number(_) => Cell::new(v).fg(Color::Yellow),
                        Value::Array(_) => {
                            Cell::new(&Value::from_str("[ARRAY]").unwrap()).fg(Color::White)
                        }

                        _ => Cell::new(v),
                    };

                    cell
                })
                .collect()
        })
        .collect();

    table.add_rows(rows);

    println!("{table}");

    Ok(())
}

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::*;

    #[test]
    fn test_input_from_string() {
        let json = r#"[{"id":1,"name":"John","age":23},{"id":2,"name":"Alice","age":1}]"#;
        let input = Input::from_str(json).unwrap();

        assert_eq!(
            input.0,
            json!([
                {"id": 1, "name": "John", "age": 23},
                {"id": 2, "name": "Alice", "age": 1}
            ])
        );
    }
}
