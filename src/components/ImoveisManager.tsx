import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Property,
  HighlightLevel,
  PropertyStatus,
  PropertyType,
  PropertyPurpose,
  TopografiaType,
  OcupacaoUsoType,
  FiftyPartnerInfo,
  LegalDocType
} from '../types';
import { PROPERTY_TYPE_OPTIONS, getPropertyTypeLabel } from '../utils/propertyHelpers';
import { fetchAddressByCep, formatCep, formatCurrencyBRL, parseCurrencyInput } from '../utils/cepHelper';
import { DocumentosJuridicosModal } from './DocumentosJuridicosModal';
import { ArchiveReasonModal } from './ArchiveReasonModal';
import {
  Building2,
  Plus,
  Star,
  Sparkles,
  Edit,
  Trash2,
  Archive,
  ArchiveRestore,
  MapPin,
  CheckCircle,
  Clock,
  DollarSign,
  Bed,
  Bath,
  Maximize2,
  Car,
  Search,
  X,
  Image as ImageIcon,
  Upload,
  ImagePlus,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Check,
  GripVertical,
  Move,
  Users,
  FileText,
  Loader2,
  FileCheck,
  Share2,
  Compass,
  TreePine,
  ShieldCheck,
  Receipt,
  Download
} from 'lucide-react';

export const ImoveisManager: React.FC = () => {
  const {
    properties,
    addProperty,
    updateProperty,
    deleteProperty,
    archiveProperty,
    unarchiveProperty,
    deleteProperties,
    clearAllProperties,
    users,
    currentUser,
    addAuditLog
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [propertyViewMode, setPropertyViewMode] = useState<'ativos' | 'arquivados'>('ativos');
  const [highlightFilter, setHighlightFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Archive Reason Modal State
  const [archiveModalConfig, setArchiveModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    itemType: 'lead' | 'imovel' | 'documento';
    itemName: string;
    onConfirm: (reason: string) => Promise<void> | void;
  } | null>(null);

  // Modal State for New / Edit Property
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPropId, setEditingPropId] = useState<string | null>(null);
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([]);

  // Legal Document Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docModalProperty, setDocModalProperty] = useState<Property | null>(null);
  const [initialDocType, setInitialDocType] = useState<LegalDocType>('ficha_captacao');

  // Backup file input ref
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    try {
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 5).replace(':', '-');
      const backupObj = {
        version: '1.0',
        exportedAt: now.toISOString(),
        totalProperties: properties.length,
        properties
      };
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `imoveis_backup_${dateStr}_${timeStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('success', 'Backup gerado e baixado com sucesso!');
    } catch (err) {
      console.error('Error generating backup:', err);
      showToast('error', 'Falha ao exportar backup de imóveis.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const importedList = parsed.properties || (Array.isArray(parsed) ? parsed : []);

        if (!Array.isArray(importedList) || importedList.length === 0) {
          showToast('error', 'O arquivo de backup selecionado é inválido ou não possui imóveis.');
          return;
        }

        let importedCount = 0;
        importedList.forEach((p: Property) => {
          if (p.id && p.title && p.price) {
            updateProperty(p);
            importedCount++;
          }
        });

        showToast('success', `Backup restaurado com sucesso! ${importedCount} imóveis carregados.`);
      } catch (err) {
        console.error('Error parsing backup file:', err);
        showToast('error', 'Erro ao processar arquivo JSON de backup.');
      }
      if (backupFileInputRef.current) backupFileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  // Form states
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PropertyType>('apartamento');
  const [purpose, setPurpose] = useState<PropertyPurpose>('venda');
  const [price, setPrice] = useState<number | ''>('');
  const [condoFee, setCondoFee] = useState<number | ''>('');
  const [areaSqM, setAreaSqM] = useState<number | ''>('');
  const [bedrooms, setBedrooms] = useState<number | ''>(2);
  const [bathrooms, setBathrooms] = useState<number | ''>(2);
  const [suites, setSuites] = useState<number | ''>(1);
  const [parkingSpaces, setParkingSpaces] = useState<number | ''>(1);
  const [highlight, setHighlight] = useState<HighlightLevel>('standard');
  const [status, setStatus] = useState<PropertyStatus>('disponivel');
  
  // Specific conditional fields
  const [testadaMeters, setTestadaMeters] = useState<number | ''>('');
  const [topografia, setTopografia] = useState<TopografiaType>('plano');
  const [ocupacaoUso, setOcupacaoUso] = useState<OcupacaoUsoType>('residencial');
  const [iptuValue, setIptuValue] = useState<number | ''>('');
  const [iptuInputMask, setIptuInputMask] = useState('');

  // Address & CEP states
  const [cep, setCep] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [complement, setComplement] = useState('');

  // Fifty / Partner Broker state
  const [isFiftyEnabled, setIsFiftyEnabled] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerCreci, setPartnerCreci] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerPercentage, setPartnerPercentage] = useState<number>(50);
  const [partnerAgency, setPartnerAgency] = useState('');
  const [partnerNotes, setPartnerNotes] = useState('');

  // Gallery & Upload
  const [images, setImages] = useState<string[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<Record<string, string>>({});
  const [photoToDelete, setPhotoToDelete] = useState<{ index: number; url: string } | null>(null);
  const [showClearAllPhotosConfirm, setShowClearAllPhotosConfirm] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [agentId, setAgentId] = useState<string>(currentUser?.id || users[0]?.id || '');
  const [featuresText, setFeaturesText] = useState('Piscina, Varanda Gourmet, Ar Condicionado, Segurança 24h');
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const activePropsCount = properties.filter(p => !p.archived).length;
  const archivedPropsCount = properties.filter(p => p.archived).length;

  const filtered = properties.filter(p => {
    const isArchived = Boolean(p.archived);
    if (propertyViewMode === 'ativos' && isArchived) return false;
    if (propertyViewMode === 'arquivados' && !isArchived) return false;
    if (highlightFilter !== 'todos' && p.highlight !== highlightFilter) return false;
    if (statusFilter !== 'todos' && p.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(term);
      const matchCode = p.code.toLowerCase().includes(term);
      const matchNeigh = p.address.neighborhood.toLowerCase().includes(term);
      if (!matchTitle && !matchCode && !matchNeigh) return false;
    }
    return true;
  });

  // CEP Auto-fill handler
  const handleLookupCep = async (cepToQuery?: string) => {
    const raw = cepToQuery || cep;
    const clean = raw.replace(/\D/g, '');
    if (clean.length !== 8) {
      setCepError('Digite os 8 dígitos do CEP para buscar.');
      return;
    }

    setIsSearchingCep(true);
    setCepError(null);

    const res = await fetchAddressByCep(clean);
    setIsSearchingCep(false);

    if (res.success && res.data) {
      setStreet(res.data.street || street);
      setNeighborhood(res.data.neighborhood || neighborhood);
      setCity(res.data.city || city);
      setState(res.data.state || state);
      setCep(res.data.zip);
    } else {
      setCepError(res.error || 'CEP não encontrado. Preencha o endereço manualmente.');
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCep(e.target.value);
    setCep(formatted);
    setCepError(null);
    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 8) {
      handleLookupCep(digits);
    }
  };

  const handleIptuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    if (!rawVal) {
      setIptuInputMask('');
      setIptuValue('');
      return;
    }
    const num = Number(rawVal) / 100;
    setIptuValue(num);
    setIptuInputMask(formatCurrencyBRL(num));
  };

  const handleOpenAddModal = () => {
    setEditingPropId(null);
    setTitle('');
    setCode(`IMP-${Math.floor(1000 + Math.random() * 9000)}`);
    setDescription('');
    setType('apartamento');
    setPurpose('venda');
    setPrice('');
    setCondoFee('');
    setAreaSqM('');
    setBedrooms(3);
    setBathrooms(2);
    setSuites(2);
    setParkingSpaces(2);
    setHighlight('standard');
    setStatus('disponivel');

    // Conditional fields reset
    setTestadaMeters('');
    setTopografia('plano');
    setOcupacaoUso('residencial');
    setIptuValue('');
    setIptuInputMask('');

    // Address & CEP reset
    setCep('01452-000');
    setStreet('Av. Brigadeiro Faria Lima');
    setStreetNumber('1500');
    setNeighborhood('Jardins');
    setCity('São Paulo');
    setState('SP');
    setComplement('Apto 101');
    setCepError(null);

    // Fifty reset
    setIsFiftyEnabled(false);
    setPartnerName('');
    setPartnerCreci('');
    setPartnerEmail('');
    setPartnerPhone('');
    setPartnerPercentage(50);
    setPartnerAgency('');
    setPartnerNotes('');

    setImages([]);
    setImageDescriptions({});
    setPhotoToDelete(null);
    setShowClearAllPhotosConfirm(false);
    setUrlInput('');
    setAgentId(currentUser?.id || users[0]?.id || '');
    setFeaturesText('Piscina, Churrasqueira, Portaria 24h, Ar Condicionado');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Property) => {
    setEditingPropId(p.id);
    setTitle(p.title);
    setCode(p.code);
    setDescription(p.description);
    setType(p.type);
    setPurpose(p.purpose);
    setPrice(p.price);
    setCondoFee(p.condoFee || '');
    setAreaSqM(p.areaSqM);
    setBedrooms(p.bedrooms);
    setBathrooms(p.bathrooms);
    setSuites(p.suites);
    setParkingSpaces(p.parkingSpaces);
    setHighlight(p.highlight);
    setStatus(p.status);

    // Specific conditional fields
    setTestadaMeters(p.testadaMeters || '');
    setTopografia(p.topografia || 'plano');
    setOcupacaoUso(p.ocupacaoUso || 'residencial');
    const existingIptu = p.iptuValue || p.propertyTax || '';
    setIptuValue(existingIptu);
    setIptuInputMask(existingIptu ? formatCurrencyBRL(existingIptu) : '');

    // Address & CEP
    setCep(p.address?.zip ? formatCep(p.address.zip) : '');
    setStreet(p.address?.street || '');
    setStreetNumber(p.address?.number || '');
    setNeighborhood(p.address?.neighborhood || '');
    setCity(p.address?.city || 'São Paulo');
    setState(p.address?.state || 'SP');
    setComplement(p.address?.complement || '');
    setCepError(null);

    // Fifty
    if (p.fifty?.enabled) {
      setIsFiftyEnabled(true);
      setPartnerName(p.fifty.partnerName || '');
      setPartnerCreci(p.fifty.partnerCreci || '');
      setPartnerEmail(p.fifty.partnerEmail || '');
      setPartnerPhone(p.fifty.partnerPhone || '');
      setPartnerPercentage(p.fifty.partnerPercentage || 50);
      setPartnerAgency(p.fifty.partnerAgency || '');
      setPartnerNotes(p.fifty.notes || '');
    } else {
      setIsFiftyEnabled(false);
      setPartnerName('');
      setPartnerCreci('');
      setPartnerEmail('');
      setPartnerPhone('');
      setPartnerPercentage(50);
      setPartnerAgency('');
      setPartnerNotes('');
    }

    setImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setImageDescriptions(p.imageDescriptions ? { ...p.imageDescriptions } : {});
    setPhotoToDelete(null);
    setShowClearAllPhotosConfirm(false);
    setUrlInput('');
    setAgentId(p.agentId);
    setFeaturesText(p.features ? p.features.join(', ') : '');
    setFormError(null);
    setIsModalOpen(true);
  };

  // Process and compress image file via Canvas (optimized for web, mobile & Firestore size limits)
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const maxDim = 960;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            let result = canvas.toDataURL('image/jpeg', 0.68);
            
            // If still larger than ~70KB base64, scale down to 780px and 0.55 quality
            if (result.length > 95000) {
              const scaleDown = 780 / Math.max(width, height);
              const w2 = Math.round(width * scaleDown);
              const h2 = Math.round(height * scaleDown);
              canvas.width = w2;
              canvas.height = h2;
              ctx.drawImage(img, 0, 0, w2, h2);
              result = canvas.toDataURL('image/jpeg', 0.55);
            }
            resolve(result);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files: File[] = Array.from(e.target.files);

    const availableSlots = 35 - images.length;
    if (availableSlots <= 0) {
      alert('Limite máximo de 35 fotos por imóvel já atingido.');
      return;
    }

    const filesToProcess = files.slice(0, availableSlots);
    setIsProcessingFiles(true);

    try {
      const processed = await Promise.all(filesToProcess.map(f => processImageFile(f)));
      setImages(prev => [...prev, ...processed]);
    } catch (err) {
      console.error('Erro ao processar imagens:', err);
    } finally {
      setIsProcessingFiles(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    if (images.length >= 35) {
      alert('Limite máximo de 35 fotos por imóvel já atingido.');
      return;
    }
    setImages(prev => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  const requestDeletePhoto = (index: number) => {
    const url = images[index];
    if (url === undefined) return;
    setPhotoToDelete({ index, url });
  };

  const confirmDeletePhoto = () => {
    if (!photoToDelete) return;
    const { index, url } = photoToDelete;
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageDescriptions(prev => {
      const next = { ...prev };
      delete next[url];
      delete next[String(index)];
      return next;
    });
    setPhotoToDelete(null);
    showToast('success', 'Foto excluída permanentemente com sucesso!');
  };

  const handleClearAllPhotos = () => {
    setImages([]);
    setImageDescriptions({});
    setShowClearAllPhotosConfirm(false);
    showToast('success', 'Todas as fotos foram removidas com sucesso.');
  };

  const handleImageDescriptionChange = (imgUrl: string, idx: number, desc: string) => {
    setImageDescriptions(prev => ({
      ...prev,
      [imgUrl]: desc,
      [String(idx)]: desc
    }));
  };

  const handleRemoveImage = (index: number) => {
    requestDeletePhoto(index);
  };

  const handleSetMainCover = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return updated;
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages(prev => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  // Drag and Drop reordering handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setImages(prev => {
      const updated = [...prev];
      const [movedItem] = updated.splice(draggedIndex, 1);
      updated.splice(targetIndex, 0, movedItem);
      return updated;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const parseNum = (val: any): number => {
      if (typeof val === 'number') return isNaN(val) ? 0 : val;
      if (!val) return 0;
      const clean = String(val).replace(/[^\d.,]/g, '');
      const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean;
      const n = Number(normalized);
      return isNaN(n) ? 0 : n;
    };

    if (!title.trim()) {
      setFormError('Por favor, informe o título do anúncio do imóvel.');
      return;
    }

    const numericPrice = parseNum(price);
    if (!numericPrice || numericPrice <= 0) {
      setFormError('Por favor, informe um valor válido para o preço do imóvel.');
      return;
    }

    const numericArea = parseNum(areaSqM);
    if (!numericArea || numericArea <= 0) {
      setFormError('Por favor, informe a metragem/área útil (m²).');
      return;
    }

    if (!street.trim() || !neighborhood.trim() || !city.trim() || !state.trim()) {
      setFormError('Por favor, preencha os dados completos do endereço (Rua, Bairro, Cidade e UF).');
      return;
    }

    const finalCode = code.trim() || `JS-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalAgentId = agentId || currentUser?.id || users[0]?.id || 'usr_master_joel';
    const featArray = featuresText.split(',').map(s => s.trim()).filter(Boolean);
    const finalImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200'];

    const fiftyData: FiftyPartnerInfo | undefined = isFiftyEnabled ? {
      enabled: true,
      partnerName: partnerName.trim() || 'Corretor Parceiro',
      partnerCreci: partnerCreci.trim() || 'CRECI 00000-F',
      partnerEmail: partnerEmail.trim() || 'parceiro@email.com',
      partnerPhone: partnerPhone.trim() || '(11) 90000-0000',
      partnerPercentage: parseNum(partnerPercentage) || 50,
      partnerAgency: partnerAgency.trim() || undefined,
      notes: partnerNotes.trim() || undefined
    } : undefined;

    try {
      if (editingPropId) {
        const existing = properties.find(p => p.id === editingPropId);
        if (existing) {
          const updatedProp: Property = {
            ...existing,
            title: title.trim(),
            code: finalCode,
            description: description.trim(),
            type,
            purpose,
            price: numericPrice,
            condoFee: condoFee ? parseNum(condoFee) : undefined,
            propertyTax: iptuValue ? parseNum(iptuValue) : undefined,
            iptuValue: iptuValue ? parseNum(iptuValue) : undefined,
            areaSqM: numericArea,
            bedrooms: parseNum(bedrooms) || 0,
            bathrooms: parseNum(bathrooms) || 0,
            suites: parseNum(suites) || 0,
            parkingSpaces: parseNum(parkingSpaces) || 0,
            highlight,
            status,
            address: {
              street: street.trim(),
              number: streetNumber.trim() || undefined,
              neighborhood: neighborhood.trim(),
              city: city.trim(),
              state: state.trim().toUpperCase(),
              zip: cep.trim() || '01000-000',
              complement: complement.trim() || undefined
            },
            features: featArray,
            images: finalImages,
            imageDescriptions,
            agentId: finalAgentId,
            testadaMeters: testadaMeters ? parseNum(testadaMeters) : undefined,
            topografia,
            ocupacaoUso,
            fifty: fiftyData
          };

          updateProperty(updatedProp);
          showToast('success', 'Imóvel atualizado com sucesso no catálogo!');

          addAuditLog({
            action: 'Atualização de Imóvel',
            category: 'imovel',
            details: `Atualizou dados do imóvel ${finalCode} (${title.trim()}).`,
            entityId: existing.id
          });
        }
      } else {
        addProperty({
          code: finalCode,
          title: title.trim(),
          description: description.trim(),
          type,
          purpose,
          price: numericPrice,
          condoFee: condoFee ? parseNum(condoFee) : undefined,
          propertyTax: iptuValue ? parseNum(iptuValue) : undefined,
          iptuValue: iptuValue ? parseNum(iptuValue) : undefined,
          areaSqM: numericArea,
          bedrooms: parseNum(bedrooms) || 0,
          bathrooms: parseNum(bathrooms) || 0,
          suites: parseNum(suites) || 0,
          parkingSpaces: parseNum(parkingSpaces) || 0,
          highlight,
          status,
          address: {
            street: street.trim(),
            number: streetNumber.trim() || undefined,
            neighborhood: neighborhood.trim(),
            city: city.trim(),
            state: state.trim().toUpperCase(),
            zip: cep.trim() || '01000-000',
            complement: complement.trim() || undefined
          },
          features: featArray,
          images: finalImages,
          imageDescriptions,
          agentId: finalAgentId,
          testadaMeters: testadaMeters ? parseNum(testadaMeters) : undefined,
          topografia,
          ocupacaoUso,
          fifty: fiftyData
        });
        showToast('success', 'Novo imóvel cadastrado com sucesso!');

        addAuditLog({
          action: 'Cadastro de Novo Imóvel',
          category: 'imovel',
          details: `Cadastrou imóvel ${finalCode} (${title.trim()}) com valor de R$ ${numericPrice}.`,
          entityId: finalCode
        });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error in property submit:', err);
      setFormError('Erro ao salvar imóvel. Verifique os dados informados.');
    }
  };

  const handleOpenDocHub = (p: Property, docType: LegalDocType = 'ficha_captacao') => {
    setDocModalProperty(p);
    setInitialDocType(docType);
    setIsDocModalOpen(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);
  };

  // Helper check for conditional terrain/house/farm fields
  const isTerrainOrHouseOrFarm = type === 'terreno' || type === 'chacara' || type === 'casa';

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl text-xs font-bold shadow-xl border flex items-center justify-between animate-fade-in ${
          toastMessage.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
            : 'bg-rose-50 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 border-rose-300 dark:border-rose-700'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <span>{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md">
        <div className="flex items-center gap-2">
          <span className="p-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-2xl">
            <Building2 className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Gestão de Catálogo de Imóveis
            </h1>
            <p className="text-xs text-slate-500">
              Gerencie cadastros completos, campos técnicos, parceria Fifty e emissão de documentos jurídicos.
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar título, bairro, código..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
            />
          </div>

          <select
            value={highlightFilter}
            onChange={e => setHighlightFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
          >
            <option value="todos">Todos Destaques</option>
            <option value="super_destaque">Super Destaque VIP</option>
            <option value="destaque">Destaque</option>
            <option value="standard">Standard</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200"
          >
            <option value="todos">Todos Status</option>
            <option value="disponivel">Disponível</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>

          {/* Toggle Ativos / Arquivados */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setPropertyViewMode('ativos')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                propertyViewMode === 'ativos'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Ativos ({activePropsCount})
            </button>

            <button
              type="button"
              onClick={() => setPropertyViewMode('arquivados')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                propertyViewMode === 'arquivados'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Arquivados ({archivedPropsCount})</span>
            </button>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Imóvel</span>
          </button>

          <button
            onClick={handleExportBackup}
            title="Baixar Backup Datado do Catálogo"
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Backup</span>
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja limpar todos os imóveis da carteira? Esta ação esvaziará o catálogo para você subir seus próprios imóveis permanentemente.')) {
                  clearAllProperties();
                  addAuditLog({
                    action: 'Limpeza de Carteira',
                    category: 'imovel',
                    details: 'Removeu todos os imóveis da carteira.',
                    entityId: 'clear_all'
                  });
                }
              }}
              title="[Administrador] Limpar todos os imóveis para subir carteira própria"
              className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpar Todos</span>
            </button>
          )}

          {selectedPropertyIds.length > 0 && currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                if (confirm(`Tem certeza que deseja excluir os ${selectedPropertyIds.length} imóveis selecionados?`)) {
                  deleteProperties(selectedPropertyIds);
                  addAuditLog({
                    action: 'Exclusão em Lote',
                    category: 'imovel',
                    details: `Removeu ${selectedPropertyIds.length} imóveis selecionados.`,
                    entityId: 'batch_delete'
                  });
                  setSelectedPropertyIds([]);
                }
              }}
              title="[Administrador] Excluir imóveis selecionados"
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 animate-pulse"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir Selecionados ({selectedPropertyIds.length})</span>
            </button>
          )}

          <input
            type="file"
            ref={backupFileInputRef}
            onChange={handleImportBackup}
            accept=".json"
            className="hidden"
          />

          <button
            onClick={() => backupFileInputRef.current?.click()}
            title="Restaurar Imóveis de Arquivo JSON de Backup"
            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Upload className="w-4 h-4" />
            <span>Restaurar Backup</span>
          </button>
        </div>
      </div>

      {/* Property List Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/80 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedPropertyIds.length === filtered.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPropertyIds(filtered.map(p => p.id));
                      } else {
                        setSelectedPropertyIds([]);
                      }
                    }}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    title="Selecionar todos visíveis"
                  />
                </th>
                <th className="p-4">Imóvel / Código</th>
                <th className="p-4">Tipo / Ocupação</th>
                <th className="p-4">Preço / IPTU</th>
                <th className="p-4">Endereço & Cidade</th>
                <th className="p-4">Fifty / Parceria</th>
                <th className="p-4">Destaque</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações & Documentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map(prop => {
                const agent = users.find(u => u.id === prop.agentId);
                const isSelected = selectedPropertyIds.includes(prop.id);
                return (
                  <tr key={prop.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-750 transition-colors ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPropertyIds(prev => [...prev, prop.id]);
                          } else {
                            setSelectedPropertyIds(prev => prev.filter(id => id !== prop.id));
                          }
                        }}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-11 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-700">
                          <img
                            src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'}
                            alt={prop.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block line-clamp-1">{prop.title}</span>
                          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-bold">{prop.code}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{getPropertyTypeLabel(prop.type)}</span>
                      <span className="text-[11px] text-slate-500 uppercase">
                        {prop.ocupacaoUso ? prop.ocupacaoUso : 'Residencial'} {prop.testadaMeters ? `• ${prop.testadaMeters}m frente` : ''}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-black text-slate-900 dark:text-white block">{formatCurrency(prop.price)}</span>
                      <span className="text-[11px] text-slate-500">
                        {prop.iptuValue || prop.propertyTax ? `IPTU: ${formatCurrency(prop.iptuValue || prop.propertyTax || 0)}` : 'Sem IPTU'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="text-slate-700 dark:text-slate-300 block">{prop.address.neighborhood}</span>
                      <span className="text-[11px] text-slate-500">{prop.address.city} - {prop.address.state}</span>
                    </td>

                    <td className="p-4">
                      {prop.fifty?.enabled ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                          <Users className="w-3 h-3" />
                          <span>Fifty {prop.fifty.partnerPercentage}% ({prop.fifty.partnerName.split(' ')[0]})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Direto (Sem Fifty)</span>
                      )}
                    </td>

                    <td className="p-4">
                      {prop.images && prop.images.length >= 3 ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                          📸 Destaque Fotos ({prop.images.length})
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Padrão ({prop.images?.length || 0} fotos)</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        prop.status === 'disponivel'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : prop.status === 'reservado'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {prop.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Legal Documents Button */}
                        <button
                          onClick={() => handleOpenDocHub(prop, 'ficha_captacao')}
                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800 transition-all"
                          title="Gerar Documentos Jurídicos (Ficha, Recibos, Contratos)"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        {/* Fifty contract quick generator if fifty enabled */}
                        {prop.fifty?.enabled && (
                          <button
                            onClick={() => handleOpenDocHub(prop, 'contrato_parceria')}
                            className="p-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-700 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 transition-all"
                            title="Gerar Contrato de Parceria (Fifty)"
                          >
                            <Users className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenEditModal(prop)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-all"
                          title="Editar Imóvel"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {prop.archived ? (
                          <button
                            type="button"
                            onClick={() => unarchiveProperty(prop.id)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-all"
                            title="Desarquivar Imóvel"
                          >
                            <ArchiveRestore className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setArchiveModalConfig({
                                isOpen: true,
                                title: 'Arquivar Imóvel do Catálogo',
                                itemType: 'imovel',
                                itemName: `${prop.code} - ${prop.title}`,
                                onConfirm: async (reason) => {
                                  await archiveProperty(prop.id, reason);
                                }
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-all"
                            title="Arquivar Imóvel"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}

                        {currentUser?.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`[ADMINISTRADOR] Tem certeza que deseja excluir o imóvel ${prop.code} (${prop.title}) do catálogo permanentemente?`)) {
                                deleteProperty(prop.id);
                                addAuditLog({
                                  action: 'Exclusão de Imóvel',
                                  category: 'imovel',
                                  details: `Excluiu o imóvel ${prop.code} (${prop.title}).`,
                                  entityId: prop.id
                                });
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-all"
                            title="[Administrador] Excluir Imóvel Definitivamente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT PROPERTY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">
                    {editingPropId ? 'Editar Cadastro do Imóvel' : 'Cadastrar Novo Imóvel'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Preencha os dados completos do imóvel com CEP automático e regras condicionais por tipo.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Título do Anúncio *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Ex: Mansão em Condomínio Fechado com Piscina Privativa..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Código do Imóvel</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-indigo-600 dark:text-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Descrição Detalhada</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Escreva sobre os acabamentos, iluminação, vista, segurança e infraestrutura do imóvel..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Type, Purpose & Financials */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Tipo de Imóvel *</label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as PropertyType)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                  >
                    {PROPERTY_TYPE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Finalidade</label>
                  <select
                    value={purpose}
                    onChange={e => setPurpose(e.target.value as PropertyPurpose)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="venda">Venda</option>
                    <option value="aluguel">Aluguel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ex: 1500000"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-indigo-600 dark:text-indigo-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Taxa Condomínio (R$)</label>
                  <input
                    type="number"
                    value={condoFee}
                    onChange={e => setCondoFee(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ex: 1200"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* ==================== 1. CAMPOS ESPECÍFICOS CONDICIONAIS ==================== */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/60 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-black uppercase tracking-wider text-[11px] text-indigo-900 dark:text-indigo-300">
                    Características Específicas do Tipo & Tributação
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* Testada (metragem de frente) - condicional para terrenos, chácaras e casas */}
                  {isTerrainOrHouseOrFarm && (
                    <div className="animate-in fade-in duration-150">
                      <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Testada / Frente (Metros)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={testadaMeters}
                        onChange={e => setTestadaMeters(e.target.value ? Number(e.target.value) : '')}
                        placeholder="Ex: 15.5"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-800 rounded-xl font-bold"
                      />
                      <span className="text-[10px] text-slate-500">Metragem de frente do lote</span>
                    </div>
                  )}

                  {/* Topografia (select: plano, aclive, declive, irregular, outros) */}
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Topografia do Terreno
                    </label>
                    <select
                      value={topografia}
                      onChange={e => setTopografia(e.target.value as TopografiaType)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="plano">Plano</option>
                      <option value="aclive">Aclive</option>
                      <option value="declive">Declive</option>
                      <option value="irregular">Irregular</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  {/* Tipo de Ocupação / Uso: Rural, Residencial ou Condomínio */}
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Tipo de Ocupação / Uso
                    </label>
                    <select
                      value={ocupacaoUso}
                      onChange={e => setOcupacaoUso(e.target.value as OcupacaoUsoType)}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="residencial">Residencial</option>
                      <option value="condominio">Condomínio Fechado</option>
                      <option value="rural">Rural</option>
                      <option value="comercial">Comercial</option>
                      <option value="misto">Misto</option>
                    </select>
                  </div>

                  {/* Valor de IPTU (Campo monetário com máscara) */}
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Valor de IPTU (R$)
                    </label>
                    <input
                      type="text"
                      value={iptuInputMask}
                      onChange={handleIptuChange}
                      placeholder="R$ 0,00"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                    <span className="text-[10px] text-slate-500">Valor mensal ou cota única</span>
                  </div>

                </div>
              </div>

              {/* Area & Rooms */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Área Total/Útil (m²) *</label>
                  <input
                    type="number"
                    required
                    value={areaSqM}
                    onChange={e => setAreaSqM(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Quartos</label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={e => setBedrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Suítes</label>
                  <input
                    type="number"
                    value={suites}
                    onChange={e => setSuites(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Banheiros</label>
                  <input
                    type="number"
                    value={bathrooms}
                    onChange={e => setBathrooms(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Vagas</label>
                  <input
                    type="number"
                    value={parkingSpaces}
                    onChange={e => setParkingSpaces(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* ==================== 2. LOCALIZAÇÃO E PREENCHIMENTO AUTOMÁTICO PELO CEP ==================== */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-black uppercase tracking-wider text-[11px] text-slate-700 dark:text-slate-300">
                      Endereço & Localização (Preenchimento Automático por CEP)
                    </span>
                  </div>
                  {isSearchingCep && (
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Consultando ViaCEP...</span>
                    </span>
                  )}
                </div>

                {cepError && (
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-xl text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{cepError}</span>
                  </div>
                )}

                {/* CEP Input + Search Button */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      CEP (8 dígitos) *
                    </label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={cep}
                        onChange={handleCepChange}
                        placeholder="00000-000"
                        maxLength={9}
                        className="flex-1 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleLookupCep()}
                        disabled={isSearchingCep}
                        className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 shrink-0"
                        title="Consultar CEP"
                      >
                        {isSearchingCep ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Logradouro / Rua *
                    </label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      placeholder="Rua, Avenida, Alameda..."
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={streetNumber}
                      onChange={e => setStreetNumber(e.target.value)}
                      placeholder="Ex: 120"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      required
                      value={neighborhood}
                      onChange={e => setNeighborhood(e.target.value)}
                      placeholder="Ex: Jardins"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="São Paulo"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                      Estado (UF) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={state}
                      onChange={e => setState(e.target.value.toUpperCase())}
                      placeholder="SP"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                    Complemento / Bloco
                  </label>
                  <input
                    type="text"
                    value={complement}
                    onChange={e => setComplement(e.target.value)}
                    placeholder="Ex: Apto 101 Bloco B"
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* ==================== 3. FIFTY / INDICAÇÃO DE CORRETOR PARCEIRO ==================== */}
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFiftyEnabled}
                      onChange={e => setIsFiftyEnabled(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span className="font-black uppercase tracking-wider text-[11px] text-amber-950 dark:text-amber-300">
                      Parceria Fifty (Indicação de Corretor Externo)
                    </span>
                  </label>

                  {isFiftyEnabled && (
                    <button
                      type="button"
                      onClick={() => {
                        const tempProp: Property = {
                          id: editingPropId || 'temp_prop',
                          code: code || 'IMP-TEMP',
                          title: title || 'Imóvel em Parceria',
                          description,
                          type,
                          purpose,
                          price: Number(price) || 500000,
                          areaSqM: Number(areaSqM) || 100,
                          bedrooms: Number(bedrooms) || 2,
                          bathrooms: Number(bathrooms) || 2,
                          suites: Number(suites) || 1,
                          parkingSpaces: Number(parkingSpaces) || 1,
                          highlight,
                          status,
                          address: { street, neighborhood, city, state, zip: cep },
                          features: [],
                          images,
                          agentId,
                          createdAt: new Date().toISOString(),
                          fifty: {
                            enabled: true,
                            partnerName,
                            partnerCreci,
                            partnerEmail,
                            partnerPhone,
                            partnerPercentage
                          }
                        };
                        handleOpenDocHub(tempProp, 'contrato_parceria');
                      }}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl shadow transition-all flex items-center gap-1.5"
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>Gerar Contrato de Parceria</span>
                    </button>
                  )}
                </div>

                {isFiftyEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-amber-200 dark:border-amber-800/50 animate-in fade-in duration-150">
                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Nome do Corretor Parceiro *
                      </label>
                      <input
                        type="text"
                        value={partnerName}
                        onChange={e => setPartnerName(e.target.value)}
                        placeholder="Ex: Roberto Mendes"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        CRECI do Parceiro *
                      </label>
                      <input
                        type="text"
                        value={partnerCreci}
                        onChange={e => setPartnerCreci(e.target.value)}
                        placeholder="Ex: CRECI 45678-F"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        E-mail do Parceiro
                      </label>
                      <input
                        type="email"
                        value={partnerEmail}
                        onChange={e => setPartnerEmail(e.target.value)}
                        placeholder="roberto@corretor.com"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Telefone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={partnerPhone}
                        onChange={e => setPartnerPhone(e.target.value)}
                        placeholder="(11) 98888-7777"
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Divisão de Comissão (% do Parceiro)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={1}
                          max={99}
                          value={partnerPercentage}
                          onChange={e => setPartnerPercentage(Number(e.target.value))}
                          className="w-20 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-center font-black"
                        />
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          % para o parceiro | <span className="text-emerald-600 dark:text-emerald-400">{100 - partnerPercentage}% para você</span>
                        </span>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">
                        Observações da Parceria
                      </label>
                      <input
                        type="text"
                        value={partnerNotes}
                        onChange={e => setPartnerNotes(e.target.value)}
                        placeholder="Ex: Cliente indicado pelo parceiro para visita dia 15..."
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Status, Highlights & Broker Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Destaque na Vitrine</label>
                  <div className="p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300">
                    ⚡ Automático por fotos ({images.length} cadastradas)
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Status</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as PropertyStatus)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="disponivel">Disponível</option>
                    <option value="reservado">Reservado</option>
                    <option value="vendido">Vendido</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Corretor Responsável</label>
                  <select
                    value={agentId}
                    onChange={e => setAgentId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Multi-Photo Upload & Gallery Management (Up to 35 photos with Drag and Drop & Descriptions) */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="block font-black text-xs text-slate-700 dark:text-slate-200 uppercase">
                      Galeria de Fotos do Imóvel (Arraste e Solte para Ordenar)
                    </label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Adicione até 35 fotos. A primeira foto (#1) é a <span className="font-bold text-amber-600 dark:text-amber-400">Capa do Anúncio</span>. Digite a legenda/descrição de cada foto para aparecer no site.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {images.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowClearAllPhotosConfirm(true)}
                        className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-1 border border-rose-200 dark:border-rose-900/60 transition-all shadow-xs"
                        title="Apagar todas as fotos cadastradas"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Apagar Todas as Fotos</span>
                      </button>
                    )}
                    <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      images.length >= 35 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}>
                      {images.length} / 35 fotos
                    </span>
                  </div>
                </div>

                {/* Dropzone & Multi-file Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      multiple
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {isProcessingFiles ? 'Comprimindo e Otimizando Fotos...' : 'Selecionar Fotos do Computador/Celular'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      PNG, JPG, WEBP (Múltipla seleção permitida)
                    </span>
                  </div>

                  {/* Add by Web URL */}
                  <div className="flex flex-col justify-center space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Ou adicionar link de foto (URL)</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        placeholder="https://exemplo.com/foto.jpg"
                        className="flex-1 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        disabled={images.length >= 35 || !urlInput.trim()}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-lg text-xs transition-all disabled:opacity-50"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Drag and Drop instructions & indicator */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-700 dark:text-indigo-300">
                    <Move className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      <strong className="font-bold">Arraste e solte:</strong> Clique e segure em qualquer foto para arrastá-la até a posição desejada. A foto na posição <strong>#1</strong> será a capa do anúncio.
                    </span>
                  </div>
                )}

                {/* Thumbnails Grid with Drag & Drop and Description Inputs */}
                {images.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-1">
                    {images.map((img, idx) => {
                      const isBeingDragged = draggedIndex === idx;
                      const isDropTarget = dragOverIndex === idx && draggedIndex !== idx;
                      const currentDesc = imageDescriptions[img] || imageDescriptions[String(idx)] || '';

                      return (
                        <div
                          key={idx}
                          className={`group flex flex-col rounded-2xl overflow-hidden border-2 bg-white dark:bg-slate-900 transition-all duration-150 shadow-sm ${
                            isBeingDragged
                              ? 'opacity-30 scale-95 ring-2 ring-indigo-500 border-indigo-500 border-dashed'
                              : isDropTarget
                              ? 'ring-4 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 border-indigo-500 z-20 shadow-xl'
                              : idx === 0
                              ? 'border-amber-500 shadow-md ring-2 ring-amber-400/30'
                              : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                          }`}
                        >
                          {/* Image Box */}
                          <div
                            draggable
                            onDragStart={e => handleDragStart(e, idx)}
                            onDragOver={e => handleDragOver(e, idx)}
                            onDragLeave={handleDragLeave}
                            onDrop={e => handleDrop(e, idx)}
                            onDragEnd={handleDragEnd}
                            className="relative aspect-[4/3] bg-slate-950 cursor-grab active:cursor-grabbing overflow-hidden"
                          >
                            <img
                              src={img}
                              alt={`Foto ${idx + 1}`}
                              className="w-full h-full object-cover pointer-events-none"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (!target.src.includes('unsplash.com')) {
                                  target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80';
                                }
                              }}
                            />

                            {/* Top Header Overlay with Badges and Direct Delete Button */}
                            <div className="absolute top-2 inset-x-2 flex items-center justify-between z-10 pointer-events-auto">
                              <div className="flex items-center gap-1 pointer-events-none">
                                <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow">
                                  <GripVertical className="w-2.5 h-2.5 opacity-70" /> #{idx + 1}
                                </span>
                                {idx === 0 && (
                                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 shadow">
                                    <Star className="w-2.5 h-2.5 fill-current" /> Capa
                                  </span>
                                )}
                              </div>

                              {/* Explicit Red Delete Button ("X" / Trash icon) */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  requestDeletePhoto(idx);
                                }}
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-lg text-[10px] font-black flex items-center gap-1 shadow-lg transition-all border border-rose-400/40 cursor-pointer"
                                title="Apagar foto permanentemente"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Apagar</span>
                              </button>
                            </div>

                            {/* Drag Target Indicator */}
                            {isDropTarget && (
                              <div className="absolute inset-0 bg-indigo-600/30 backdrop-blur-[1px] border-2 border-indigo-500 flex items-center justify-center z-15 pointer-events-none">
                                <span className="bg-indigo-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                                  <Move className="w-3.5 h-3.5" /> Soltar aqui
                                </span>
                              </div>
                            )}

                            {/* Actions overlay for Reordering */}
                            <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 z-20 pointer-events-none">
                              <div className="space-y-1 pointer-events-auto">
                                {idx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSetMainCover(idx);
                                    }}
                                    className="w-full py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black rounded-lg flex items-center justify-center gap-1 transition-all shadow"
                                  >
                                    <Star className="w-3 h-3 fill-current" /> Definir como Capa Principal
                                  </button>
                                )}

                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveImage(idx, 'left');
                                    }}
                                    disabled={idx === 0}
                                    className="flex-1 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center gap-1"
                                    title="Mover para esquerda"
                                  >
                                    ◀ Mover
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveImage(idx, 'right');
                                    }}
                                    disabled={idx === images.length - 1}
                                    className="flex-1 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg hover:bg-slate-700 disabled:opacity-30 flex items-center justify-center gap-1"
                                    title="Mover para direita"
                                  >
                                    Mover ▶
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Photo Description Input Field */}
                          <div className="p-2.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3 text-indigo-500 shrink-0" />
                                <span>Descrição da Foto</span>
                              </span>
                              <span className="text-[9px] text-slate-400 font-normal">No site</span>
                            </div>
                            <input
                              type="text"
                              value={currentDesc}
                              onChange={(e) => handleImageDescriptionChange(img, idx, e.target.value)}
                              placeholder="Ex: Fachada principal, Sala integrada, Cozinha gourmet..."
                              className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 uppercase mb-1">Recursos / Diferenciais (Separados por vírgula)</label>
                <input
                  type="text"
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                  placeholder="Piscina, Espaço Gourmet, Ar Condicionado, Gerador..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all text-xs flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{editingPropId ? 'Salvar Alterações do Imóvel' : 'Cadastrar Imóvel no Catálogo'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE EXCLUSÃO PERMANENTE DE FOTO INDIVIDUAL */}
      {photoToDelete && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Excluir Foto Permanentemente?
                </h3>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
                  Aviso de Exclusão Definitiva
                </p>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
              <img
                src={photoToDelete.url}
                alt="Foto a ser excluída"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('unsplash.com')) {
                    target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200';
                  }
                }}
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-xs text-white text-[11px] font-mono font-bold">
                Foto #{photoToDelete.index + 1}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tem certeza de que deseja apagar esta foto do imóvel? Ela será <strong>excluída permanentemente</strong> e não poderá ser recuperada.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDeletePhoto}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir Definitivamente</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE APAGAR TODAS AS FOTOS */}
      {showClearAllPhotosConfirm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/60 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Apagar Todas as Fotos do Imóvel?
                </h3>
                <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider">
                  Exclusão em Lote
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tem certeza de que deseja excluir todas as <strong>{images.length} fotos</strong> e legendas deste cadastro? Todas serão removidas permanentemente deste formulário.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowClearAllPhotosConfirm(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClearAllPhotos}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Apagar Todas as Fotos</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTOS JURÍDICOS MODAL */}
      <DocumentosJuridicosModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        property={docModalProperty}
        initialDocType={initialDocType}
      />

      {/* ARCHIVE REASON MODAL */}
      {archiveModalConfig && (
        <ArchiveReasonModal
          isOpen={archiveModalConfig.isOpen}
          onClose={() => setArchiveModalConfig(null)}
          title={archiveModalConfig.title}
          itemType={archiveModalConfig.itemType}
          itemName={archiveModalConfig.itemName}
          onConfirm={archiveModalConfig.onConfirm}
        />
      )}

    </div>
  );
};
