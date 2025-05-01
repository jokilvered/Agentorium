import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check, Image, Palette, ArrowLeft, ArrowRight, Save, Loader } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Form Schema
const agentFormSchema = z.object({
  name: z.string().min(3, {
    message: "Agent name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  price: z.coerce.number().min(1000, {
    message: "Minimum price is 1,000 tokens.",
  }),
  royaltyPercent: z.coerce.number().min(0).max(10, {
    message: "Royalty percentage must be between 0% and 10%.",
  }),
  listImmediately: z.boolean().default(false),
  avatar: z.string(),
  accentColor: z.string(),
});

// Type inference for form values
type AgentFormValues = z.infer<typeof agentFormSchema>;

// Default values
const defaultValues: Partial<AgentFormValues> = {
  name: "",
  description: "",
  category: "",
  price: 5000,
  royaltyPercent: 2.5,
  listImmediately: false,
  avatar: "https://placehold.co/64x64/agentorium-blue/white?text=AI",
  accentColor: "#1E88E5",
};

// Categories and Avatar options
const categories = [
  "Assistant",
  "Analyzer",
  "Helper",
  "Developer",
  "Finance",
  "Creative",
  "Education"
];

const avatarOptions = [
  "https://placehold.co/64x64/agentorium-blue/white?text=AI",
  "https://placehold.co/64x64/agentorium-cyan/white?text=AG",
  "https://placehold.co/64x64/purple/white?text=BOT",
  "https://placehold.co/64x64/orange/white?text=GPT",
];

// Color options
const colorOptions = [
  "#1E88E5", // Blue
  "#00ACC1", // Cyan
  "#7E57C2", // Purple
  "#FF7043", // Orange
  "#43A047", // Green
  "#E53935", // Red
];

const CreateAgentForm = ({ onClose }) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Loading state
  const totalSteps = 3;

  // Initialize form with react-hook-form v7.53.0 compatible setup
  const form = useForm<AgentFormValues>({
    defaultValues,
    resolver: zodResolver(agentFormSchema),
    mode: "onChange"
  });

  // Handle form submission
  const onSubmit = async (data: AgentFormValues) => {
    setLoading(true); // Set loading to true when starting the submission
    try {
      // Prepare data for API
      const formData = {
        name: data.name,
        description: data.description,
        category: data.category,
        profilePicture: data.avatar,
        accentColor: data.accentColor,
        price: data.price,
        royaltyPercent: data.royaltyPercent,
        listImmediately: data.listImmediately,
        capabilities: [0, 1, 2, 3, 4] // Default capabilities
      };

      // API call
      const response = await axios.post('http://localhost:3000/agents', formData);

      // Success notification
      toast({
        title: "Agent Created Successfully",
        description: data.listImmediately
          ? "Your agent has been created and listed on the marketplace."
          : "Your agent has been created and saved as draft.",
        variant: "default",
      });

      // Close form
      onClose();
    } catch (error) {
      console.error("Failed to create agent:", error);
      toast({
        title: "Creation Failed",
        description: "There was an error creating your agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Step navigation with proper validation for react-hook-form v7.53.0
  const nextStep = async () => {
    // Validate fields for current step before proceeding
    let fieldsToValidate = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['name', 'description', 'category'];
        break;
      case 2:
        fieldsToValidate = ['avatar', 'accentColor'];
        break;
      default:
        break;
    }

    const result = await form.trigger(fieldsToValidate, { shouldFocus: true });
    if (result) {
      setStep(Math.min(step + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(Math.max(step - 1, 1));
  };

  // Step 1: Basic Information
  const BasicInfoStep = () => (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter agent name" {...field} />
            </FormControl>
            <FormDescription>
              Choose a memorable name for your agent.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe what your agent does..."
                className="min-h-24"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Clearly explain your agent's purpose and capabilities.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the category that best fits your agent.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  // Step 2: Appearance
  const AppearanceStep = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="avatar"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agent Avatar</FormLabel>
            <FormControl>
              <div className="grid grid-cols-4 gap-3">
                {avatarOptions.map((avatar) => (
                  <div
                    key={avatar}
                    className={`
                      relative cursor-pointer rounded-md overflow-hidden border-2
                      ${field.value === avatar ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}
                    `}
                    onClick={() => form.setValue('avatar', avatar)}
                  >
                    <img
                      src={avatar}
                      alt="Avatar option"
                      className="w-16 h-16 object-cover"
                    />
                    {field.value === avatar && (
                      <div className="absolute bottom-1 right-1 bg-primary rounded-full p-1">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </FormControl>
            <FormDescription>
              Select an avatar that represents your agent's identity.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="accentColor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Accent Color</FormLabel>
            <FormControl>
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-2">
                  {colorOptions.map((color) => (
                    <div
                      key={color}
                      className={`
                        h-8 rounded-md cursor-pointer
                        ${field.value === color ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'}
                      `}
                      style={{ backgroundColor: color }}
                      onClick={() => form.setValue('accentColor', color)}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-md"
                    style={{ backgroundColor: field.value }}
                  />
                  <Input
                    type="color"
                    {...field}
                    className="w-auto p-0 h-10"
                  />
                  <span className="text-sm font-medium">{field.value}</span>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Choose a color that will be used as your agent's theme.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  // Step 3: Tokenization
  const TokenizationStep = () => (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price (in tokens)</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Slider
                  min={1000}
                  max={50000}
                  step={1000}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
                <div className="flex justify-between">
                  <span className="text-sm">1,000</span>
                  <Input
                    type="number"
                    className="w-24"
                    min={1000}
                    max={50000}
                    {...field}
                  />
                  <span className="text-sm">50,000</span>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Set the price in tokens for using your agent.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="royaltyPercent"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Royalty Percentage</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Slider
                  min={0}
                  max={10}
                  step={0.5}
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
                <div className="flex justify-between">
                  <span className="text-sm">0%</span>
                  <div className="flex items-center">
                    <Input
                      type="number"
                      className="w-16"
                      min={0}
                      max={10}
                      step={0.5}
                      {...field}
                    />
                    <span className="ml-1">%</span>
                  </div>
                  <span className="text-sm">10%</span>
                </div>
              </div>
            </FormControl>
            <FormDescription>
              Set the percentage of royalties you'll receive from each use.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="listImmediately"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">List Immediately</FormLabel>
              <FormDescription>
                Make your agent available on the marketplace right away.
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );

  // Render the appropriate step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <AppearanceStep />;
      case 3:
        return <TokenizationStep />;
      default:
        return null;
    }
  };

  // Step titles
  const stepTitles = [
    "Basic Information",
    "Appearance",
    "Tokenization"
  ];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="pb-4">
        <CardTitle>Create New Agent</CardTitle>
        <div className="mt-2">
          <Progress value={(step / totalSteps) * 100} className="h-1" />
          <div className="flex justify-between mt-2">
            {stepTitles.map((title, index) => (
              <Badge
                key={index}
                variant={step > index ? "default" : "outline"}
                className={step === index + 1 ? "bg-primary" : ""}
              >
                {title}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form id="agent-form" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {renderStepContent()}
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        ) : (
          <div></div>
        )}

        {step < totalSteps ? (
          <Button
            type="button"
            onClick={nextStep}
            className="flex items-center"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            form="agent-form"
            type="submit"
            className="flex items-center"
            disabled={loading} // Disable the button when loading
          >
            {loading ? (
              <Loader className="animate-spin mr-2 h-4 w-4" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {loading ? "Creating..." : "Create Agent"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CreateAgentForm;
