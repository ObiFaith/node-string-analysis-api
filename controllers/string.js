import StringModel from "../models/string.js";
import { StatusCodes } from "http-status-codes";
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
  UnprocessableEntityError,
} from "../errors/index.js";

const findStringOrFail = async value => {
  const string = await StringModel.findOne({ value: value.toLowerCase() });
  if (!string) throw new NotFoundError("String does not exist in the system!");
  return string;
};

export const getStringByNL = async (req, res) => {
  const original = req.query.query;
  const cleaned = original.replace(/[^\w\s]/g, "");
  const words = cleaned.trim().split(" ");
  const keywords = [
    "word",
    "than",
    "words",
    "contain",
    "containing",
    "palindrome",
    "palindromic",
  ];

  const hasNoKeyword = words.every(
    word => !keywords.includes(word.toLowerCase())
  );

  if (!words.length || hasNoKeyword)
    throw new BadRequestError("Unable to parse natural language query!");

  const filters = {};
  const queryObjects = {};

  if (words.includes("palindrome") || words.includes("palindromic")) {
    filters.palindrome = !words.includes("not");
    queryObjects["properties.is_palindrome"] = !words.includes("not");
  }

  if (words.includes("word") || words.includes("words")) {
    if (words.includes("single")) {
      filters.word_count = 1;
    } else if (words.includes("double")) {
      filters.word_count = 2;
    } else if (words.includes("triple")) {
      filters.word_count = 3;
    }

    queryObjects["properties.word_count"] = filters.word_count;
  }

  if (words.includes("than")) {
    const longerIndex = words.indexOf("longer");
    const shorterIndex = words.indexOf("shorter");

    if (longerIndex !== -1) {
      filters.min_length = Number(words[longerIndex + 2]) + 1;
      queryObjects["properties.length"] = { $gte: filters.min_length };
    }

    if (shorterIndex !== -1) {
      filters.max_length = Number(words[shorterIndex + 2]) - 1;
      queryObjects["properties.length"] = {
        ...queryObjects["properties.length"],
        $lte: filters.max_length,
      };
    }
  }

  if (words.includes("contain") || words.includes("containing")) {
    const letter = words[words.indexOf("letter") + 1];
    filters.contains_character = letter;
    queryObjects.value = { $regex: letter, $options: "i" };
  }

  console.log("queryObjects:", queryObjects);

  const data = await StringModel.find(queryObjects).sort("created_at");

  res.status(StatusCodes.OK).json({
    data,
    count: data.length,
    interpreted_query: { original, parsed_filters: filters },
  });
};

export const getStrings = async (req, res) => {
  const queryObjects = {};
  const {
    min_length,
    max_length,
    word_count,
    is_palindrome,
    contains_character,
  } = req.query;

  if (min_length)
    queryObjects["properties.length"] = { $gte: Number(min_length) };

  if (max_length)
    queryObjects["properties.length"] = {
      ...queryObjects["properties.length"],
      $lte: Number(max_length),
    };

  if (word_count) queryObjects["properties.word_count"] = Number(word_count);

  if (is_palindrome)
    queryObjects["properties.is_palindrome"] = is_palindrome === "true";

  if (contains_character)
    queryObjects.value = { $regex: contains_character, $options: "i" };

  const data = await StringModel.find(queryObjects).sort("created_at");

  res
    .status(StatusCodes.OK)
    .json({ data, count: data.length, filters_applied: req.query });
};

export const createString = async (req, res) => {
  let { value } = req.body;

  if (typeof value !== "string") {
    throw new UnprocessableEntityError(
      'Invalid data type for "value" (must be string)'
    );
  }

  if (!value.trim() || !isNaN(value))
    throw new BadRequestError('Invalid request body or missing "value" field');

  value = value.toLowerCase();
  const existingValue = await StringModel.findOne({ value });

  if (existingValue)
    throw new ConflictError("String already exists in the system!");

  const string = await StringModel.create({ value });

  res.status(StatusCodes.CREATED).json(string);
};

export const getString = async (req, res) => {
  const string = await findStringOrFail(req.params.value);
  res.status(StatusCodes.OK).json(string);
};

export const deleteString = async (req, res) => {
  const string = await findStringOrFail(req.params.value);
  await StringModel.deleteOne({ _id: string._id });
  res.status(StatusCodes.NO_CONTENT).send();
};
