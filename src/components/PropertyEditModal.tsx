import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  Upload,
  MapPin,
  Search,
  AlertCircle,
  Image,
} from "lucide-react";
import {
  geocodeAddress,
  ST_PETERSBURG_CENTER,
  formatStPetersburgAddress,
  isStPetersburgAddress,
} from "@/lib/geocoding";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { YandexMiniMap } from "./YandexMiniMap";

export interface Property {
  id: string;
  title: string;
  price: number;
  bedrooms: number | string;
  bathrooms: number | string;
  area: number;
  status: "available" | "limited" | "booked";
  images: string[];
  amenities: string[];
  address: string;
  description: string;
  lat: number;
  lng: number;
}

interface PropertyEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onSave: (property: Property) => void;
  isNew?: boolean;
}

const defaultProperty: Omit<Property, "id"> = {
  title: "",
  price: 0,
  bedrooms: 1,
  bathrooms: 1,
  area: 0,
  status: "available",
  images: [],
  amenities: [],
  address: "",
  description: "",
  lat: ST_PETERSBURG_CENTER.lat,
  lng: ST_PETERSBURG_CENTER.lng,
};

const availableAmenities = [
  "Кондиционер",
  "Балкон",
  "Парковка",
  "Интернет",
  "Безопасность",
  "Детская площадка",
  "Спортзал",
  "Консьерж",
  "Прачечная",
  "Сад",
  "Мебель",
  "Кухня",
  "WiFi",
  "Близко к метро",
  "Магазины рядом",
  "Лифт",
  "Охрана",
  "Видеонаблюдение",
  "Домофон",
  "Терраса",
  "Камин",
  "Джакузи",
  "Кондиционирование",
  "Отопление",
];

export function PropertyEditModal({
  isOpen,
  onClose,
  property,
  onSave,
  isNew = false,
}: PropertyEditModalProps) {
  const [formData, setFormData] = useState<Property>(
    property || ({ ...defaultProperty, id: `new-${Date.now()}` } as Property),
  );
  const [newAmenity, setNewAmenity] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof Property, string>>>(
    {},
  );
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState("");
  const [addressWarning, setAddressWarning] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (property) {
      setFormData(property);
    } else if (isNew) {
      setFormData({ ...defaultProperty, id: `new-${Date.now()}` } as Property);
    }
  }, [property, isNew]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Property, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Название обязательно";
    }

    if (formData.price <= 0) {
      newErrors.price = "Цена должна быть больше 0";
    }

    if (formData.area <= 0) {
      newErrors.area = "Площадь должна быть больше 0";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Адрес обязателен";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Описание обязательно";
    }

    if (formData.images.length === 0) {
      newErrors.images = "Добавьте хотя бы одно изображение";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressChange = (newAddress: string) => {
    setFormData({ ...formData, address: newAddress });

    // Clear previous warnings/errors
    setGeocodingError("");
    setAddressWarning("");

    // Check if address seems to be in St. Petersburg
    if (newAddress.trim() && !isStPetersburgAddress(newAddress)) {
      setAddressWarning("Рекомендуется указывать адрес в Санкт-Петербурге");
    }
  };

  const handleGeocodeAddress = async () => {
    if (!formData.address.trim()) {
      setGeocodingError("Введите адрес для поиска координат");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError("");

    try {
      const result = await geocodeAddress(formData.address);

      if (!result) {
        setGeocodingError("Не удалось найти координаты для данного адреса");
        return;
      }

      if (!result.isInStPetersburg) {
        setGeocodingError("Адрес находится за пределами Санкт-Петербурга");
        return;
      }

      // Update coordinates
      setFormData({
        ...formData,
        lat: result.lat,
        lng: result.lng,
        address: formatStPetersburgAddress(formData.address),
      });

      setAddressWarning("");
    } catch (error) {
      setGeocodingError("Ошибка при поиске координат. Попробуйте позже.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    setErrors({});
    setNewAmenity("");
    setNewImageUrl("");
    setGeocodingError("");
    setAddressWarning("");
    setIsGeocoding(false);
    onClose();
  };

  const addAmenity = (amenity: string) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity],
      });
    }
    setNewAmenity("");
  };

  const removeAmenity = (amenityToRemove: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter(
        (amenity) => amenity !== amenityToRemove,
      ),
    });
  };

  const addImage = () => {
    if (newImageUrl && !formData.images.includes(newImageUrl)) {
      setFormData({
        ...formData,
        images: [...formData.images, newImageUrl],
      });
    }
    setNewImageUrl("");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Пожалуйста, выберите изображение");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Размер файла не должен превышать 5MB");
      return;
    }

    setIsUploadingImage(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      if (base64String && !formData.images.includes(base64String)) {
        setFormData({
          ...formData,
          images: [...formData.images, base64String],
        });
      }
      setIsUploadingImage(false);
    };

    reader.onerror = () => {
      alert("Ошибка при загрузке файла");
      setIsUploadingImage(false);
    };

    reader.readAsDataURL(file);

    // Clear the input
    event.target.value = "";
  };

  const removeImage = (imageToRemove: string) => {
    setFormData({
      ...formData,
      images: formData.images.filter((image) => image !== imageToRemove),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neutral-900">
            {isNew ? "Добавить новый объект" : "Редактировать объект"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 border-b pb-2">
              Основная информация
            </h3>

            <div>
              <Label htmlFor="title">Название объекта *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={errors.title ? "border-red-500" : ""}
                placeholder="Например: Роскошный Downtown Лофт"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Описание *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className={errors.description ? "border-red-500" : ""}
                placeholder="Подробное описание квартиры..."
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Цена (₽/мес) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: parseInt(e.target.value) || 0,
                    })
                  }
                  className={errors.price ? "border-red-500" : ""}
                  placeholder="85000"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>

              <div>
                <Label htmlFor="area">Площадь (кв.м) *</Label>
                <Input
                  id="area"
                  type="number"
                  value={formData.area}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area: parseInt(e.target.value) || 0,
                    })
                  }
                  className={errors.area ? "border-red-500" : ""}
                  placeholder="120"
                />
                {errors.area && (
                  <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bedrooms">Спальни</Label>
                <Input
                  id="bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bedrooms: e.target.value })
                  }
                  placeholder="2 или Студия"
                />
              </div>

              <div>
                <Label htmlFor="bathrooms">Ванные</Label>
                <Input
                  id="bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) =>
                    setFormData({ ...formData, bathrooms: e.target.value })
                  }
                  placeholder="1.5"
                />
              </div>

              <div>
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "available" | "limited" | "booked") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Доступно</SelectItem>
                    <SelectItem value="limited">Ограничено</SelectItem>
                    <SelectItem value="booked">Забронировано</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 border-b pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Местоположение (Санкт-Петербург)
            </h3>

            <div className="space-y-3">
              <div>
                <Label htmlFor="address">Адрес *</Label>
                <div className="flex gap-2">
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                    placeholder="Невский проспект, 28, Санкт-Петербург"
                  />
                  <Button
                    type="button"
                    onClick={handleGeocodeAddress}
                    disabled={isGeocoding || !formData.address.trim()}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {isGeocoding ? (
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
                {addressWarning && (
                  <Alert className="mt-2 border-yellow-200 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-700">
                      {addressWarning}
                    </AlertDescription>
                  </Alert>
                )}
                {geocodingError && (
                  <Alert className="mt-2 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {geocodingError}
                    </AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-neutral-500 mt-1">
                  Нажмите кнопку поиска для автоматического определения
                  координат
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Широта</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lat: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="59.9311"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  СПб: 59.7 - 60.1
                </p>
              </div>

              <div>
                <Label htmlFor="lng">Долгота</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      lng: parseFloat(e.target.value) || 0,
                    })
                  }
                  placeholder="30.3609"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  СПб: 29.5 - 30.8
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 <strong>Совет:</strong> Введите адрес и нажмите кнопку
                  поиска для автоматического определения точных координат на
                  карте.
                </p>
              </div>

              {/* Yandex Mini Map Preview */}
              <div>
                <Label className="text-sm font-medium text-neutral-700 mb-2 block">
                  Предварительный просмотр на Яндекс Картах
                </Label>
                <YandexMiniMap
                  lat={formData.lat}
                  lng={formData.lng}
                  height="200px"
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Положение объекта на карте (обновляется автоматически)
                </p>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 border-b pb-2 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Изображения
            </h3>

            {/* File Upload and URL Input */}
            <div className="space-y-3">
              {/* File Upload Button */}
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors ${
                    isUploadingImage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploadingImage ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Загрузить с компьютера
                    </>
                  )}
                </label>
              </div>

              {/* URL Input */}
              <div className="flex gap-2">
                <Input
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Или введите URL изображения"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={addImage}
                  disabled={!newImageUrl.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-xs text-neutral-500">
                Поддерживаемые форматы: JPG, PNG, GIF. Максимальный размер: 5MB
              </p>
            </div>

            {errors.images && (
              <p className="text-red-500 text-sm">{errors.images}</p>
            )}

            {/* Image Gallery */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src =
                        `https://via.placeholder.com/300x200/E5E7EB/6B7280?text=Изображение ${index + 1}`;
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Удалить изображение"
                  >
                    <X className="w-3 h-3" />
                  </button>

                  {/* Image type indicator */}
                  <div className="absolute bottom-1 left-1">
                    {image.startsWith("data:") ? (
                      <Badge className="bg-green-600 text-white text-xs">
                        Файл
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-600 text-white text-xs">
                        URL
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900 border-b pb-2">
              Удобства
            </h3>

            <div className="flex gap-2">
              <Select value={newAmenity} onValueChange={setNewAmenity}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Выберите удобство" />
                </SelectTrigger>
                <SelectContent>
                  {availableAmenities
                    .filter((amenity) => !formData.amenities.includes(amenity))
                    .map((amenity) => (
                      <SelectItem key={amenity} value={amenity}>
                        {amenity}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={() => addAmenity(newAmenity)}
                disabled={!newAmenity}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.amenities.map((amenity, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(amenity)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-brand-orange hover:bg-brand-500"
            >
              {isNew ? "Создать объект" : "Сохранить изменения"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
