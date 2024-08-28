import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createForm = async (req: Request, res: Response) => {
  const data = req.body;
  const { formName, formFields } = data;
  try {
    const form = await prisma.form.create({
      data: {
        formName,
        formFields: {
          create: formFields.map((field: any) => ({
            label: field.label,
            type: field.type,
            required: field.required,
            errorMessage: field.errorMessage,
            value: field.value,
            placeholder: field.placeholder,
            options: field.options,
            subtype: field.subtype,
          })),
        },
      },
      include: { formFields: true },
    });
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: "Failed to create form" });
  }
};

export const getAllForms = async (req: Request, res: Response) => {
  try {
    const forms = await prisma.form.findMany({ include: { formFields: true } });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve forms" });
  }
};

export const getForm = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const form = await prisma.form.findUnique({
      where: { id },
      include: { formFields: true },
    });
    if (form) {
      res.json(form);
    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve form" });
  }
};

export const submitResponse = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { fields } = req.body;
  try {
    const response = await prisma.response.create({
      data: {
        formId: id,
        formFields: {
          create: fields.map((field: any) => ({
            value: field.value,
            fieldId: field.id,
          })),
        },
      },
      include: { formFields: true },
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit response" });
  }
};

export const getFormResponses = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const responses = await prisma.response.findMany({
      where: { formId: id },
      include: { formFields: true },
    });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve responses" });
  }
};
