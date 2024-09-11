'use client';

import * as React from "react";
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ContainerTypeSelectProps = {
  onSelectType: (type: string) => void;
};

export default function ContainerTypeSelect({ onSelectType }: ContainerTypeSelectProps) {
  const [selectedType, setSelectedType] = useState('all');

  const handleSelectChange = (value: string) => {
    setSelectedType(value);
    onSelectType(value);
  };

  return (
    <div className="mb-4">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[100%]">
          <SelectValue placeholder="Selecione o tipo de caixa que gostaria de visualziar " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipos de Containers</SelectLabel>
            <SelectItem value="all">Todas as caixas cadastradas</SelectItem>
            <SelectItem value="no-children">Caixas sem caixas filha</SelectItem>
            <SelectItem value="no-parent">Caixas sem caixas pai</SelectItem>
            <SelectItem value="with-parent-children">Caixas com caixas pai e filhas</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
